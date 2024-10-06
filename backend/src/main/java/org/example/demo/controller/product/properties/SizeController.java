package org.example.demo.controller.product.properties;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.SizeRequestDTO;
import org.example.demo.dto.product.response.properties.SizeResponseDTO;
import org.example.demo.entity.product.properties.Size; // Đổi từ Origin sang Size
import org.example.demo.mapper.product.request.properties.SizeRequestMapper; // Đổi từ OriginRequestMapper sang SizeRequestMapper
import org.example.demo.mapper.product.response.properties.SizeResponseMapper;
import org.example.demo.service.product.properties.SizeService; // Đổi từ OriginService sang SizeService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequestMapping("size")
public class SizeController {
    @Autowired
    private SizeService sizeService; // Đổi từ originService sang sizeService
    @Autowired
    private SizeRequestMapper sizeRequestMapper; // Đổi từ originRequestMapper sang sizeRequestMapper
    @Autowired
    private SizeResponseMapper sizeResponseMapper; // Đổi từ originResponseMapper sang sizeResponseMapper

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(sizeService.findAll(pageable)); // Đổi từ originService sang sizeService
    }
    @GetMapping("/size")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(sizeService.findAllList());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Size> getSizeDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Origin sang Size
        Size size = sizeService.findById(id); // Đổi từ originService sang sizeService
        if (size == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "SizeDetail not found"); // Đổi từ OriginDetail sang SizeDetail
        }
        return ResponseEntity.ok(size);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<SizeResponseDTO> updateSize(
            @PathVariable Integer id,
            @RequestBody SizeRequestDTO requestDTO) { // Đổi từ OriginRequestDTO sang SizeRequestDTO
        try {
            Size updatedSize = sizeService.update(id, requestDTO); // Đổi từ originService sang sizeService

            SizeResponseDTO responseDTO = new SizeResponseDTO( // Đổi từ OriginResponseDTO sang SizeResponseDTO
                    updatedSize.getCode(),
                    updatedSize.getName(),
                    updatedSize.getDeleted()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSize(@PathVariable Integer id) throws BadRequestException { // Đổi từ Origin sang Size
        try {
            sizeService.delete(id); // Đổi từ originService sang sizeService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Size not found with id: " + id); // Đổi từ Origin sang Size
        }
    }

    @PostMapping("/save")
    public ResponseEntity<SizeResponseDTO> saveSize(@RequestBody SizeRequestDTO requestDTO) { // Đổi từ OriginRequestDTO sang SizeRequestDTO
        try {
            Size size = sizeService.save(requestDTO); // Đổi từ originService sang sizeService

            SizeResponseDTO responseDTO = new SizeResponseDTO( // Đổi từ OriginResponseDTO sang SizeResponseDTO
                    size.getCode(),
                    size.getName(),
                    size.getDeleted()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}