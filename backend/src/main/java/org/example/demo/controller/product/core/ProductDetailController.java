package org.example.demo.controller.product.core;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.core.ProductDetailRequestDTO;
import org.example.demo.dto.product.response.core.ProductDetailResponseDTO;
import org.example.demo.dto.product.response.properties.ProductResponseDTO;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.service.product.core.ProductDetailService;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("productDetails")
public class ProductDetailController {

    @Autowired
    private ProductDetailService productDetailService;

    @GetMapping("")
    public ResponseEntity<Page<ProductDetail>> findAll(Pageable pageable) {
        Page<ProductDetail> productDetails = productDetailService.findAll(pageable);
        return ResponseEntity.ok(productDetails);
    }

    @PostMapping(value = "details")
    public ResponseEntity<Page<ProductDetailResponseDTO>> getProductDetails(
            @RequestParam(required = false) Integer productId,
            @RequestParam(value = "createdFrom", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdFrom,
            @RequestParam(value = "createdTo", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdTo,
            @Valid @RequestBody PageableObject pageableObject,
            BindingResult bindingResult
    ) throws BindException {
        // Kiểm tra lỗi
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        System.out.println("productId: " + productId);
        System.out.println("createdFrom: " + createdFrom);
        System.out.println("createdTo: " + createdTo);
        System.out.println("pageableObject: " + pageableObject);

        // Gọi dịch vụ để lấy dữ liệu sản phẩm
        Page<ProductDetailResponseDTO> productDetails = productDetailService.findAllProductDetailsOverviewByPage(
                productId,
                createdFrom,
                createdTo,
                pageableObject
        );

        return ResponseEntity.ok(productDetails);
    }



    @GetMapping("/{id}")
    public ResponseEntity<ProductDetail> findById(@PathVariable Integer id) {
        try {
            ProductDetail productDetail = productDetailService.findById(id);
            return ResponseEntity.ok(productDetail);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }

    @PostMapping("save")
    public ResponseEntity<ProductDetail> save(@Valid @RequestBody ProductDetailRequestDTO requestDTO) {
        try {
            ProductDetail savedProductDetail = productDetailService.save(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProductDetail);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
    }

    @PutMapping("update/{id}")
    public ResponseEntity<ProductDetail> update(@PathVariable Integer id, @Valid @RequestBody ProductDetailRequestDTO requestDTO) {
        try {
            ProductDetail updatedProductDetail = productDetailService.update(id, requestDTO);
            return ResponseEntity.ok(updatedProductDetail);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        try {
            productDetailService.delete(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("saveAll")
    public ResponseEntity<List<ProductDetail>> saveAll(@Valid @RequestBody List<ProductDetailRequestDTO> requestDTOList) {
        try {
            List<ProductDetail> savedProductDetails = productDetailService.saveAll(requestDTOList);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProductDetails);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
