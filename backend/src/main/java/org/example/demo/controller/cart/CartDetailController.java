package org.example.demo.controller.cart;

import org.example.demo.dto.cart.request.CreateCartDetailDTO;
import org.example.demo.entity.cart.core.CartDetail;
import org.example.demo.entity.cart.properties.Cart;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.repository.cart.CartDetailRepository;
import org.example.demo.repository.cart.CartRepository;
import org.example.demo.repository.product.core.ProductDetailRepository;
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

    @GetMapping("/in-cart/{id}")
    public ResponseEntity<?> getAllCartDetailsByCartId(@PathVariable("id") Integer id) {
        List<CartDetail> cartDetailList = cartDetailRepository.findByCartId(id);
        return ResponseEntity.ok(cartDetailList);
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
        CartDetail cartDetail = new CartDetail();
        cartDetail.setCart(cart);
        cartDetail.setProductDetail(productDetail);
        return ResponseEntity.ok(cartDetailRepository.save(cartDetail));
    }
}
