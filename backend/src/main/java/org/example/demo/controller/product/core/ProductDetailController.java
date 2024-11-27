package org.example.demo.controller.product.core;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.core.ProductDetailRequestDTO;
import org.example.demo.dto.product.response.core.ProductDetailResponseDTO;
import org.example.demo.dto.upload.UploadDTO;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.exception.CustomExceptions;
import org.example.demo.service.product.core.ProductDetailService;
import org.example.demo.util.FileUploadUtil;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("productDetails")
public class ProductDetailController {

    @Autowired
    private ProductDetailService productDetailService;



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

        // Gọi dịch vụ để lấy dữ liệu sản phẩm
        Page<ProductDetailResponseDTO> productDetails = productDetailService.findAllProductDetailsOverviewByPage(
                productId,
                createdFrom,
                createdTo,
                pageableObject
        );

        return ResponseEntity.ok(productDetails);
    }

    @PostMapping("findById")
    public ResponseEntity<ProductDetail> getProductDetailById(
            @RequestParam(required = false) Integer id
    ) {
        if (id == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        try {
            ProductDetail productDetail = productDetailService.findById(id);
            return new ResponseEntity<>(productDetail, HttpStatus.OK);
        } catch (BadRequestException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/save-all")
    public ResponseEntity<List<ProductDetail>> saveAllProducts(@RequestBody List<ProductDetailRequestDTO> requestDTOs) {
        try {
            List<ProductDetail> savedProducts = productDetailService.saveAll(requestDTOs);
            return ResponseEntity.ok(savedProducts);
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDetail> updateProductDetail(
            @PathVariable Integer id,
            @RequestBody @Valid ProductDetailRequestDTO productDetailRequestDTO
    ) {
        try {
            // Cập nhật ProductDetail thông qua service
            ProductDetail updatedProductDetail = productDetailService.update(id, productDetailRequestDTO);

            // Trả về ResponseEntity với mã trạng thái HTTP 200 và đối tượng đã cập nhật
            return ResponseEntity.ok(updatedProductDetail);
        } catch (BadRequestException e) {
            // Nếu có lỗi, trả về mã trạng thái 400 và thông điệp lỗi
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ProductDetail> deleteProductDetail(@PathVariable Integer id) {
        try {
            ProductDetail deletedProduct = productDetailService.delete(id);
            return new ResponseEntity<>(deletedProduct, HttpStatus.OK);
        } catch (BadRequestException e) {
            // Handle the BadRequestException if needed, e.g., return a custom message or status code
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }







}
