package org.example.demo.controller.product.properties;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.OriginRequestDTO;
import org.example.demo.dto.product.response.properties.OriginResponseDTO;
import org.example.demo.entity.product.properties.Origin; // Đổi từ Material sang Origin
import org.example.demo.mapper.product.request.properties.OriginRequestMapper; // Đổi từ MaterialRequestMapper sang OriginRequestMapper
import org.example.demo.mapper.product.response.properties.OriginResponseMapper;
import org.example.demo.service.product.properties.OriginService; // Đổi từ MaterialService sang OriginService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequestMapping("origin")
public class OriginController {
    @Autowired
    private OriginService originService; // Đổi từ materialService sang originService
    @Autowired
    private OriginRequestMapper originRequestMapper; // Đổi từ materialRequestMapper sang originRequestMapper
    @Autowired
    private OriginResponseMapper originResponseMapper; // Đổi từ materialResponseMapper sang originResponseMapper

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(originService.findAll(pageable)); // Đổi từ materialService sang originService
    }
    @GetMapping("/origin")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(originService.findAllList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Origin> getOriginDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Material sang Origin
        Origin origin = originService.findById(id); // Đổi từ materialService sang originService
        if (origin == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "OriginDetail not found"); // Đổi từ MaterialDetail sang OriginDetail
        }
        return ResponseEntity.ok(origin);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<OriginResponseDTO> updateOrigin(
            @PathVariable Integer id,
            @RequestBody OriginRequestDTO requestDTO) { // Đổi từ MaterialRequestDTO sang OriginRequestDTO
        try {
            Origin updatedOrigin = originService.update(id, requestDTO); // Đổi từ materialService sang originService

            OriginResponseDTO responseDTO = new OriginResponseDTO( // Đổi từ MaterialResponseDTO sang OriginResponseDTO
                    updatedOrigin.getCode(),
                    updatedOrigin.getName(),
                    updatedOrigin.getDeleted()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteOrigin(@PathVariable Integer id) throws BadRequestException { // Đổi từ Material sang Origin
        try {
            originService.delete(id); // Đổi từ materialService sang originService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Origin not found with id: " + id); // Đổi từ Material sang Origin
        }
    }

    @PostMapping("/save")
    public ResponseEntity<OriginResponseDTO> saveOrigin(@RequestBody OriginRequestDTO requestDTO) { // Đổi từ MaterialRequestDTO sang OriginRequestDTO
        try {
            Origin origin = originService.save(requestDTO); // Đổi từ materialService sang originService

            OriginResponseDTO responseDTO = new OriginResponseDTO( // Đổi từ MaterialResponseDTO sang OriginResponseDTO
                    origin.getCode(),
                    origin.getName(),
                    origin.getDeleted()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}