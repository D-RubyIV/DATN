package org.example.demo.service.order_detail;

import jakarta.persistence.EntityManager;
import lombok.extern.slf4j.Slf4j;
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
        orderDetailRepository.delete(orderDetail);
        entityManager.flush();
        orderService.reloadSubTotalOrder(orderDetail.getOrder());
        return orderDetail;
    }

    @Override
    @Transactional
    public OrderDetail save(OrderDetailRequestDTO requestDTO) {
        int requiredQuantity = requestDTO.getQuantity();
        // tìm kiếm hóa đơn chi tiết
        Optional<OrderDetail> entityFound = orderDetailRepository.findByOrderIdAndProductDetailIdAndAverageDiscountEventPercent(requestDTO.getOrderId(), requestDTO.getProductDetailId(), requestDTO.getAverageDiscountEventPercent());
        // tìm kiếm sản phẩm chi tiết
        ProductDetail productDetail = productDetailRepository.findById(requestDTO.getProductDetailId()).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Product detail not found"));
        // nếu tồn tại hóa đơn chi tiết và sản phẩm chi tiết

        if (!idAvailableQuantityProductDetail(productDetail, requiredQuantity)) {
            throw new CustomExceptions.CustomBadRequest("Không đủ số lượng đáp ứng");
        }

        // ==> GHI ĐÈ HOẶC TẠO BẢN GHI MỚI
        if (entityFound.isPresent()) {
            entityFound.get().setDeleted(false);
            // cộng dồn số lượng cũ và mới
            int newCount = entityFound.get().getQuantity() + requiredQuantity;
            // nếu không đủ số lượng đáp ứng
            if (newCount > productDetail.getQuantity()) {
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

        // nếu số lượng mới lớn hơn trong kho
        if (newQuantity > quantityInStorage) {
            throw new CustomExceptions.CustomBadRequest("Không đủ số lượng đáp ứng");
        }
        //nếu số luọng về 0
        else if (newQuantity == 0) {
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
            orderDetail.setDeleted(false);
            orderDetail.setQuantity(newQuantity);
            orderService.reloadSubTotalOrder(orderDetail.getOrder());
            return orderDetailRepository.save(orderDetail);
        }
    }

    private void updateQuantityIfInStore(int old_quantity, int new_quantity, ProductDetail productDetail, Order order){
        if(order.getType() == Type.INSTORE){
            int rangeABS = Math.abs(new_quantity - old_quantity);
            int currentQuantityOfProductDetail = productDetail.getQuantity();
            if(new_quantity > old_quantity){
                productDetail.setQuantity(currentQuantityOfProductDetail - rangeABS);
            }
            // nếu khách giảm bớt đi
            else{
                if(currentQuantityOfProductDetail - rangeABS < 0){
                    throw new CustomExceptions.CustomBadRequest("Vui lòng kiểm tra lại kho");
                }
                else{
                    productDetail.setQuantity(currentQuantityOfProductDetail + rangeABS);
                }
            }
            productDetailRepository.save(productDetail);
        }
    }

    public Map<String, Boolean> checkAllowOverride(OrderDetailRequestDTO orderDetailRequestDTO) {
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

    private boolean idAvailableQuantityProductDetail(ProductDetail productDetail, int requiredQuantity){
        return productDetail.getQuantity() >= requiredQuantity;

    }


    public Page<OrderDetail> getPageOrderDetailByIdOrder(Integer id, Pageable pageable) {
        return orderDetailRepository.getPageOrderDetailWithPage(id, pageable);

    }
}
