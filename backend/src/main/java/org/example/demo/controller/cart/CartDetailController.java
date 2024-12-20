package org.example.demo.controller.cart;

import org.example.demo.dto.cart.request.CreateCartDetailDTO;
import org.example.demo.entity.cart.core.CartDetail;
import org.example.demo.entity.cart.properties.Cart;
import org.example.demo.entity.order.properties.OrderDetail;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.mapper.cart.response.CartDetailResponseMapper;
import org.example.demo.repository.cart.CartDetailRepository;
import org.example.demo.repository.cart.CartRepository;
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.example.demo.service.cart.CartServiceV2;
import org.example.demo.util.RandomCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "cart-details")
public class CartDetailController {
    @Autowired
    private CartDetailRepository cartDetailRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private CartDetailResponseMapper cartDetailResponseMapper;

    @Autowired
    private CartServiceV2 cartServiceV2;


    @GetMapping("/in-cart/{id}")
    public ResponseEntity<?> getAllCartDetailsByCartId(@PathVariable("id") Integer id) {
        List<CartDetail> cartDetailList = cartDetailRepository.findByCartId(id);
        return ResponseEntity.ok(cartDetailResponseMapper.toListDTO(cartDetailList));
    }

    @GetMapping(value = "quantity/update/{integer}")
    public ResponseEntity<?> updateQuantity(@PathVariable Integer integer, @RequestParam(value = "quantity", required = true) Integer newQuantity) {
        CartDetail cartDetail = cartDetailRepository.findById(integer).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Cart not found"));
        int quantityInStorage = cartDetail.getProductDetail().getQuantity();
        int quantityInOrder = cartDetail.getQuantity();

        if (newQuantity > quantityInStorage) {
            throw new CustomExceptions.CustomBadRequest("Không đủ số lượng đáp ứng");
        } else if (newQuantity == 0) {
            cartDetailRepository.delete(cartDetail);
            cartServiceV2.reloadSubTotalOrder(cartDetail.getCart());
            return ResponseEntity.ok(cartDetail);
        } else {
            cartDetail.setQuantity(newQuantity);
            cartServiceV2.reloadSubTotalOrder(cartDetail.getCart());
            return ResponseEntity.ok(cartDetailRepository.save(cartDetail));
        }
    }

    @PostMapping("create")
    public ResponseEntity<?> createCartDetail(@RequestBody CreateCartDetailDTO request) {
        Cart cart = cartRepository.findById(request.getCartId()).orElse(null);
        ProductDetail productDetail = productDetailRepository.findById(request.getProductDetailId()).orElse(null);
        if (cart == null) {
            throw new CustomExceptions.CustomBadRequest("Không tìm thấy giỏ hàng");
        }
        if (productDetail == null) {
            throw new CustomExceptions.CustomBadRequest("Không tìm thấy sản phẩm này");
        }
        //
        int productDetailQuantity = productDetail.getQuantity();
        CartDetail cartDetail = cartDetailRepository.findByCartIdAndProductDetailId(request.getCartId(), request.getProductDetailId());
        if (cartDetail != null) {
            // check quantity
            if (productDetailQuantity >= cartDetail.getQuantity() + request.getQuantity()) {
                cartDetail.setQuantity(cartDetail.getQuantity() + request.getQuantity());
            } else {
                throw new CustomExceptions.CustomBadRequest("Không đủ số lượng đáp ứng");
            }
        } else {
            cartDetail = new CartDetail();
            cartDetail.setProductDetail(productDetail);
            cartDetail.setCart(cart);
            // check quantity
            if (productDetailQuantity >= request.getQuantity()) {
                cartDetail.setQuantity(request.getQuantity());
            } else {
                throw new CustomExceptions.CustomBadRequest("Không đủ số lượng đáp ứng");
            }
        }
        CartDetail cartDetailResult = cartDetailRepository.save(cartDetail);
        cartServiceV2.reloadSubTotalOrder(cart);
        return ResponseEntity.ok(cartDetailResponseMapper.toDTO(cartDetailResult));
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> removeCartDetail(@PathVariable Integer id) {
        CartDetail cartDetail = cartDetailRepository.findById(id).orElseThrow(() -> new CustomExceptions.CustomBadRequest("Cart not found"));
        cartDetailRepository.delete(cartDetail);
        return ResponseEntity.ok("Xoá sản phẩm " + cartDetail.getProductDetail().getProduct().getName() + " khỏi giỏ hàng");
    }
}
