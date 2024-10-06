package org.example.demo.controller.product.properties;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.ElasticityRequestDTO;
import org.example.demo.dto.product.response.properties.ElasticityResponseDTO;
import org.example.demo.entity.product.properties.Elasticity; // Đổi từ Color sang Elasticity
import org.example.demo.mapper.product.request.properties.ElasticityRequestMapper; // Đổi từ ColorRequestMapper sang ElasticityRequestMapper
import org.example.demo.mapper.product.response.properties.ElasticityResponseMapper;
import org.example.demo.service.product.properties.ElasticityService; // Đổi từ ColorService sang ElasticityService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequestMapping("elasticity")
public class ElasticityController {
    @Autowired
    private ElasticityService elasticityService; // Đổi từ colorService sang elasticityService
    @Autowired
    private ElasticityRequestMapper elasticityRequestMapper; // Đổi từ colorRequestMapper sang elasticityRequestMapper
    @Autowired
    private ElasticityResponseMapper elasticityResponseMapper; // Đổi từ colorResponseMapper sang elasticityResponseMapper

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(elasticityService.findAll(pageable)); // Đổi từ colorService sang elasticityService
    }
    @GetMapping("/elasticity")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(elasticityService.findAllList());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Elasticity> getElasticityDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Color sang Elasticity
        Elasticity elasticity = elasticityService.findById(id); // Đổi từ colorService sang elasticityService
        if (elasticity == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ElasticityDetail not found"); // Đổi từ ColorDetail sang ElasticityDetail
        }
        return ResponseEntity.ok(elasticity);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ElasticityResponseDTO> updateElasticity(
            @PathVariable Integer id,
            @RequestBody ElasticityRequestDTO requestDTO) { // Đổi từ ColorRequestDTO sang ElasticityRequestDTO
        try {
            Elasticity updatedElasticity = elasticityService.update(id, requestDTO); // Đổi từ colorService sang elasticityService

            ElasticityResponseDTO responseDTO = new ElasticityResponseDTO( // Đổi từ ColorResponseDTO sang ElasticityResponseDTO
                    updatedElasticity.getCode(),
                    updatedElasticity.getName(),
                    updatedElasticity.getDeleted()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteElasticity(@PathVariable Integer id) throws BadRequestException { // Đổi từ Color sang Elasticity
        try {
            elasticityService.delete(id); // Đổi từ colorService sang elasticityService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Elasticity not found with id: " + id); // Đổi từ Color sang Elasticity
        }
    }

    @PostMapping("/save")
    public ResponseEntity<ElasticityResponseDTO> saveElasticity(@RequestBody ElasticityRequestDTO requestDTO) { // Đổi từ ColorRequestDTO sang ElasticityRequestDTO
        try {
            Elasticity elasticity = elasticityService.save(requestDTO); // Đổi từ colorService sang elasticityService

            ElasticityResponseDTO responseDTO = new ElasticityResponseDTO( // Đổi từ ColorResponseDTO sang ElasticityResponseDTO
                    elasticity.getCode(),
                    elasticity.getName(),
                    elasticity.getDeleted()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}