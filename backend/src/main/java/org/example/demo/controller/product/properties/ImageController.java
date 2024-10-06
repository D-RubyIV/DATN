package org.example.demo.controller.product.properties;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.ImageRequestDTO;
import org.example.demo.dto.product.response.properties.ImageResponseDTO;
import org.example.demo.entity.product.properties.Image; // Đổi từ Elasticity sang Image
import org.example.demo.mapper.product.request.properties.ImageRequestMapper; // Đổi từ ElasticityRequestMapper sang ImageRequestMapper
import org.example.demo.mapper.product.response.properties.ImageResponseMapper;
import org.example.demo.service.product.properties.ImageService; // Đổi từ ElasticityService sang ImageService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequestMapping("image")
public class ImageController {
    @Autowired
    private ImageService imageService; // Đổi từ elasticityService sang imageService
    @Autowired
    private ImageRequestMapper imageRequestMapper; // Đổi từ elasticityRequestMapper sang imageRequestMapper
    @Autowired
    private ImageResponseMapper imageResponseMapper; // Đổi từ elasticityResponseMapper sang imageResponseMapper

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(imageService.findAll(pageable)); // Đổi từ elasticityService sang imageService
    }
    @GetMapping("/image")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(imageService.findAllList());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Image> getImageDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Elasticity sang Image
        Image image = imageService.findById(id); // Đổi từ elasticityService sang imageService
        if (image == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ImageDetail not found"); // Đổi từ ElasticityDetail sang ImageDetail
        }
        return ResponseEntity.ok(image);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ImageResponseDTO> updateImage(
            @PathVariable Integer id,
            @RequestBody ImageRequestDTO requestDTO) { // Đổi từ ElasticityRequestDTO sang ImageRequestDTO
        try {
            Image updatedImage = imageService.update(id, requestDTO); // Đổi từ elasticityService sang imageService

            ImageResponseDTO responseDTO = new ImageResponseDTO( // Đổi từ ElasticityResponseDTO sang ImageResponseDTO
                    updatedImage.getCode(),
                    updatedImage.getName(),
                    updatedImage.getDeleted()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Integer id) throws BadRequestException { // Đổi từ Elasticity sang Image
        try {
            imageService.delete(id); // Đổi từ elasticityService sang imageService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Image not found with id: " + id); // Đổi từ Elasticity sang Image
        }
    }

    @PostMapping("/save")
    public ResponseEntity<ImageResponseDTO> saveImage(@RequestBody ImageRequestDTO requestDTO) { // Đổi từ ElasticityRequestDTO sang ImageRequestDTO
        try {
            Image image = imageService.save(requestDTO); // Đổi từ elasticityService sang imageService

            ImageResponseDTO responseDTO = new ImageResponseDTO( // Đổi từ ElasticityResponseDTO sang ImageResponseDTO
                    image.getCode(),
                    image.getName(),
                    image.getDeleted()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}