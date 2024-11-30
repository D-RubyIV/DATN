package org.example.demo.service.order_detail;

import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
import org.example.demo.dto.order.properties.request.AllowOverrideOrderDetailRequestDTO;
import org.example.demo.dto.order.properties.request.OrderDetailRequestDTO;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.repository.order.OrderProductDetailRepository;
import org.example.demo.repository.order.OrderRepository;
import org.example.demo.repository.order_detail.OrderDetailRepository;
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.example.demo.service.IService;
import org.example.demo.service.order.OrderService;
import org.example.demo.util.event.EventUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class OrderDetailService implements IService<OrderDetail, Integer, OrderDetailRequestDTO> {
    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderProductDetailRepository orderProductDetailRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EntityManager entityManager;

    public List<OrderDetail> findAll() {
        return orderDetailRepository.findAll();
    }

    @Override
    public OrderDetail findById(Integer integer) {
        return orderDetailRepository.findById(integer).orElseThrow(() -> new CustomExceptions.CustomBadRequest("OrderDetail not found"));
    }

    @Override
    @Transactional
    public OrderDetail delete(Integer integer) {
        OrderDetail orderDetail = findById(integer);
        ProductDetail productDetail = orderDetail.getProductDetail();
        productDetail.setQuantity(productDetail.getQuantity() + orderDetail.getQuantity());
        productDetailRepository.save(productDetail);
        orderDetailRepository.delete(orderDetail);
        entityManager.flush();
        orderService.reloadSubTotalOrder(orderDetail.getOrder());
        return orderDetail;
    }

    @Override
    @Transactional
    public OrderDetail save(OrderDetailRequestDTO requestDTO) {
        int requiredQuantity = requestDTO.getQuantity();
        // tìm kiếm sản phẩm chi tiết
        ProductDetail productDetail = productDetailRepository.findById(requestDTO.getProductDetailId()).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Product detail not found"));
        // tìm kiếm hóa đơn chi tiết
        List<OrderDetail> orderDetailList = orderDetailRepository.findAllByOrderIdAndProductDetailId(requestDTO.getOrderId(), requestDTO.getProductDetailId());
        double currentDiscountPercent = productDetail.getProduct().getNowAverageDiscountPercentEvent();

        Optional<OrderDetail> entityFound_2 = orderDetailRepository.findByOrderIdAndProductDetailIdAndAverageDiscountEventPercent(requestDTO.getOrderId(), requestDTO.getProductDetailId(), requestDTO.getAverageDiscountEventPercent());
        Optional<OrderDetail> entityFound = orderDetailRepository.findByOrderIdAndProductDetailIdAndAverageDiscountEventPercent(requestDTO.getOrderId(), requestDTO.getProductDetailId(), currentDiscountPercent);


        // nếu tồn tại hóa đơn chi tiết và sản phẩm chi tiết

        // ==> GHI ĐÈ
        if (entityFound.isPresent()) {
            if (!isAvailableQuantityProductDetail(productDetail, entityFound.get().getQuantity(), requiredQuantity)) {
                log.error("KHÔNG ĐỦ ĐÁP ỨNG");
                throw new CustomExceptions.CustomBadRequest("Không đủ số lượng đáp ứng");
            }
            // cập nhật số lượng trong kho
            updateQuantityStorageIfInStore(entityFound.get().getQuantity(), requiredQuantity, entityFound.get().getProductDetail(), entityFound.get().getOrder());

            entityFound.get().setDeleted(false);
            // cộng dồn số lượng cũ và mới
            int newCount = entityFound.get().getQuantity() + requiredQuantity;
            // nếu không đủ số lượng đáp ứng
            if (!(productDetail.getQuantity() - newCount >= 0)) {
                log.error("KHÔNG ĐỦ ĐÁP ỨNG SAU CỘNG DỒN");
                throw new CustomExceptions.CustomBadRequest("Không đủ số lượng đáp ứng");
            }
            // ngược lại nếu đủ số lượng
            else {
                entityFound.get().setQuantity(newCount);
                OrderDetail response = orderDetailRepository.save(entityFound.get());
                orderService.reloadSubTotalOrder(response.getOrder());
                return response;
            }
        }
        // ==> TẠO BẢN GHI MỚI
        // nếu không tìm thấy hóa đơn chi tiết và sản phẩm chi tiết
        else {
            if (!isAvailableQuantityProductDetail(productDetail, 0, requiredQuantity)) {
                log.error("KHÔNG ĐỦ ĐÁP ỨNG");
                throw new CustomExceptions.CustomBadRequest("Không đủ số lượng đáp ứng");
            }
            // tạo hóa đơn chi tiết mới
            OrderDetail orderDetail = new OrderDetail();
            // set trạng thái xóa cho hóa đơn
            orderDetail.setDeleted(false);
            // set số lượng
            orderDetail.setQuantity(requiredQuantity);

            // set gia trị event trung bình
            orderDetail.setAverageDiscountEventPercent(EventUtil.getAveragePercentEvent(productDetail.getProduct().getValidEvents()));
            // set hóa đơn vào hóa đơn chi tiết
            orderDetail.setOrder(orderService.findById(requestDTO.getOrderId()));
            // set spct vào hóa đơn chi tiết
            orderDetail.setProductDetail(productDetail);
            // lưu lại hóa đơn chi tết
            OrderDetail response = orderDetailRepository.save(orderDetail);
            // cập nhật số lượng trong kho
            updateQuantityStorageIfInStore(0, requiredQuantity, productDetail, orderDetail.getOrder());

            orderService.reloadSubTotalOrder(orderDetail.getOrder());
            return response;
        }
    }

    @Override
    public OrderDetail update(Integer integer, OrderDetailRequestDTO requestDTO) {
        return null;
    }

    @Transactional
    public OrderDetail updateQuantity(Integer integer, int newQuantity) {
        // tìm hóa đơn chi tiết theo id
        log.info("ĐANG TÌM HÓA ĐƠN");
        OrderDetail orderDetail = findById(integer);
        log.info("ĐÃ TÌM THẤY HÓA ĐƠN");
        // tìm hóa đơn
        Order order = orderDetail.getOrder();
        // số lương trong kho
        int quantityInStorage = orderDetail.getProductDetail().getQuantity();
        // số lượng trong hóa đơn chi tiết
        int quantityInOrder = orderDetail.getQuantity();

        // nếu số lượng mới lớn hơn trong kho và là mua thêm
        if (!isAvailableQuantityProductDetail(orderDetail.getProductDetail(), quantityInOrder, newQuantity)) {
            throw new CustomExceptions.CustomBadRequest("Không đủ số lượng đáp ứng");
        }
        //nếu số luọng về 0
        else if (newQuantity == 0) {
            updateQuantityStorageIfInStore(quantityInOrder, newQuantity, orderDetail.getProductDetail(), order);
            // nếu đơn này đã thanh toán và là đơn online => thì chỉ xóa mềm
            if (order.getIsPayment() && order.getType() == Type.ONLINE) {
                orderDetail.setDeleted(true);
                orderDetail.setQuantity(0);
            }
            // ngược lại xóa vĩnh viễn trưc tiếp
            else {
                orderDetailRepository.delete(orderDetail);
                entityManager.flush();
            }
            // cập nhật lại giá trị
            orderService.reloadSubTotalOrder(orderDetail.getOrder());
            return orderDetail;
        }
        // nếu đủ số lượng đáp ứng
        else {
            // ngăn ng dùng mua thêm với hóa đơn chi tiết có sụ thay đổi % event
            if(newQuantity > quantityInOrder){
                double currentSaleDiscountEvent = orderDetail.getProductDetail().getProduct().getNowAverageDiscountPercentEvent();
                if(orderDetail.getAverageDiscountEventPercent() != currentSaleDiscountEvent){
                    throw new CustomExceptions.CustomBadRequest("Sản phảm này đã có sự thay đổi % đợt giảm giá ");
                }
            }


            updateQuantityStorageIfInStore(quantityInOrder, newQuantity, orderDetail.getProductDetail(), order);
            orderDetail.setDeleted(false);
            orderDetail.setQuantity(newQuantity);
            orderService.reloadSubTotalOrder(orderDetail.getOrder());
            return orderDetailRepository.save(orderDetail);
        }
    }

    private void updateQuantityStorageIfInStore(int old_quantity, int new_quantity, ProductDetail productDetail, Order order) {
        if (order.getInStore()) {
            log.info("OLD QUA: {}", old_quantity);
            log.info("NEW QUA: {}", new_quantity);
            int rangeABS = Math.abs(new_quantity - old_quantity);
            int currentQuantityOfProductDetail = productDetail.getQuantity();
            if (new_quantity > old_quantity) {
                log.info("KHÁCH MUA THEM SP MÃ {}", productDetail.getCode());
                productDetail.setQuantity(currentQuantityOfProductDetail - rangeABS);
            }
            // nếu khách giảm bớt đi
            else {
                log.info("KHÁCH TRẢ LẠI SP MÃ {}", productDetail.getCode());
                productDetail.setQuantity(currentQuantityOfProductDetail + rangeABS);
            }
            productDetailRepository.save(productDetail);
        }
    }

    public Map<String, Boolean> checkAllowOverride(AllowOverrideOrderDetailRequestDTO orderDetailRequestDTO) {
        // lấy product detail
        Optional<ProductDetail> productDetail = productDetailRepository.findById(orderDetailRequestDTO.getProductDetailId());
        // lấy hóa đơn
        Optional<Order> order = orderRepository.findById(orderDetailRequestDTO.getOrderId());
        // lấy danh sách hóa đơm chi tiết dựa vào order id và product id
        List<OrderDetail> orderDetailList = orderDetailRepository.findAllByOrderIdAndProductDetailId(
                orderDetailRequestDTO.getOrderId(),
                orderDetailRequestDTO.getProductDetailId()
        );
        // thu thập list % giảm giá
        List<Double> listPercent = orderDetailList.stream().map(OrderDetail::getAverageDiscountEventPercent).toList();

        Map<String, Boolean> map = new HashMap<String, Boolean>();
        boolean changeOfEvent = false;
        // nếu ko có hóa đơn chi tiết cũ làm có giảm giá
        System.out.println(listPercent.toString());
        if (!listPercent.isEmpty()) {
            changeOfEvent = checkHasChangeOfEvent(productDetail.get(), listPercent);
        }
        log.info("HAS CHANGE EVENT: " + changeOfEvent);
        map.put("hasChange", changeOfEvent);
        return map;
    }

    public boolean checkHasChangeOfEvent(ProductDetail productDetail, List<Double> percentList) {
        double newAverageDiscountEventPercent = EventUtil.getAveragePercentEvent(productDetail.getProduct().getValidEvents());
        log.info("OLD : " + percentList.toString());
        log.info("NEW : " + newAverageDiscountEventPercent);
        return !percentList.contains(newAverageDiscountEventPercent);
    }

    private boolean isAvailableQuantityProductDetail(ProductDetail productDetail, int currentQuantity, int requiredQuantity) {
        log.info("KHO : " + productDetail.getQuantity());
        log.info("Y/C : " + requiredQuantity);
        int range = Math.abs(requiredQuantity - currentQuantity);
        // khi tổng số lượng yêu cầu lớn hơn hoặc = trong đơn hiện tại
        if (requiredQuantity >= currentQuantity) {
            // kiểm tra xem số lượng trong kho có đủ cho số lượng cần hay không
            return productDetail.getQuantity() - range >= 0;
        }
        // nếu tổng số lượng yêu cầu nhỏ hơn trong đơn hiện tại
        else {
            return true;
        }
    }

    public Page<OrderDetail> getPageOrderDetailByIdOrder(Integer id, Pageable pageable) {
        return orderDetailRepository.getPageOrderDetailWithPage(id, pageable);

    }
}
