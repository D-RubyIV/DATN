package org.example.demo.controller.cart;

import org.example.demo.dto.cart.request.CartRequestDTO;
import org.example.demo.dto.cart.response.CartResponseDTO;
import org.example.demo.infrastructure.common.ResponseObject;
import org.example.demo.service.cart.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa =))
 */
@RestController
@RequestMapping(value = "cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{idCustomer}")
    public List<CartResponseDTO> getListCart(@PathVariable Integer idCustomer) {
        return cartService.getListCart(idCustomer);
    }

    @PostMapping()
    public ResponseObject addCart(@RequestBody CartRequestDTO cartRequestDTO) {
        return cartService.update(cartRequestDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseObject deleteCart(@PathVariable Integer id) {
        return cartService.deleteById(id);
    }

    @DeleteMapping("/delete-all/{idCustomer}")
    public ResponseObject deleteAllCart(@PathVariable Integer idCustomer) {
        return cartService.deleteAll(idCustomer);
    }
}
