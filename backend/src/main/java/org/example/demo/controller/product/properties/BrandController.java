package org.example.demo.controller.product.properties;

import org.apache.coyote.BadRequestException;

import org.example.demo.dto.product.requests.properties.BrandRequestDTO;
import org.example.demo.dto.product.response.properties.BrandResponseDTO;
import org.example.demo.entity.product.properties.Brand; // Đổi từ Product sang Brand
import org.example.demo.mapper.product.request.properties.BrandRequestMapper; // Đổi từ ProductRequestMapper sang BrandRequestMapper
import org.example.demo.mapper.product.response.properties.BrandResponseMapper;
import org.example.demo.service.product.properties.BrandService; // Đổi từ ProductService sang BrandService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequestMapping("brand")
public class BrandController {
    @Autowired
    private BrandService brandService; // Đổi từ productService sang brandService
    @Autowired
    private BrandRequestMapper brandRequestMapper; // Đổi từ productRequestMapper sang brandRequestMapper
    @Autowired
    private BrandResponseMapper brandResponseMapper; // Đổi từ productResponseMapper sang brandResponseMapper

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(brandService.findAll(pageable)); // Đổi từ productService sang brandService
    }


    @GetMapping("/brand")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(brandService.findAllList());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Product sang Brand
        Brand brand = brandService.findById(id); // Đổi từ productService sang brandService
        if (brand == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "BrandDetail not found"); // Đổi từ ProductDetail sang BrandDetail
        }
        return ResponseEntity.ok(brand);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<BrandResponseDTO> updateBrand(
            @PathVariable Integer id,
            @RequestBody BrandRequestDTO requestDTO) {
        try {
            Brand updatedBrand = brandService.update(id, requestDTO); // Đổi từ productService sang brandService

            BrandResponseDTO responseDTO = new BrandResponseDTO( // Đổi từ ProductResponseDTO sang BrandResponseDTO
                    updatedBrand.getCode(),
                    updatedBrand.getName(),
                    updatedBrand.getDeleted()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable Integer id) throws BadRequestException { // Đổi từ Product sang Brand
        try {
            brandService.delete(id); // Đổi từ productService sang brandService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Brand not found with id: " + id); // Đổi từ Product sang Brand
        }
    }

    @PostMapping("/save")
    public ResponseEntity<BrandResponseDTO> saveBrand(@RequestBody BrandRequestDTO requestDTO) {
        try {
            Brand brand = brandService.save(requestDTO); // Đổi từ productService sang brandService

            BrandResponseDTO responseDTO = new BrandResponseDTO( // Đổi từ ProductResponseDTO sang BrandResponseDTO
                    brand.getCode(),
                    brand.getName(),
                    brand.getDeleted()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}