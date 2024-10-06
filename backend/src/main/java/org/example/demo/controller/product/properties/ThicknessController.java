package org.example.demo.controller.product.properties;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.ThicknessRequestDTO;
import org.example.demo.dto.product.response.properties.ThicknessResponseDTO;
import org.example.demo.entity.product.properties.Thickness; // Đổi từ Texture sang Thickness
import org.example.demo.mapper.product.request.properties.ThicknessRequestMapper; // Đổi từ TextureRequestMapper sang ThicknessRequestMapper
import org.example.demo.mapper.product.response.properties.ThicknessResponseMapper;
import org.example.demo.service.product.properties.ThicknessService; // Đổi từ TextureService sang ThicknessService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequestMapping("thickness")
public class ThicknessController {
    @Autowired
    private ThicknessService thicknessService; // Đổi từ textureService sang thicknessService
    @Autowired
    private ThicknessRequestMapper thicknessRequestMapper; // Đổi từ textureRequestMapper sang thicknessRequestMapper
    @Autowired
    private ThicknessResponseMapper thicknessResponseMapper; // Đổi từ textureResponseMapper sang thicknessResponseMapper

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(thicknessService.findAll(pageable)); // Đổi từ textureService sang thicknessService
    }
    @GetMapping("/thickness")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(thicknessService.findAllList());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Thickness> getThicknessDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Texture sang Thickness
        Thickness thickness = thicknessService.findById(id); // Đổi từ textureService sang thicknessService
        if (thickness == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ThicknessDetail not found"); // Đổi từ TextureDetail sang ThicknessDetail
        }
        return ResponseEntity.ok(thickness);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ThicknessResponseDTO> updateThickness(
            @PathVariable Integer id,
            @RequestBody ThicknessRequestDTO requestDTO) { // Đổi từ TextureRequestDTO sang ThicknessRequestDTO
        try {
            Thickness updatedThickness = thicknessService.update(id, requestDTO); // Đổi từ textureService sang thicknessService

            ThicknessResponseDTO responseDTO = new ThicknessResponseDTO( // Đổi từ TextureResponseDTO sang ThicknessResponseDTO
                    updatedThickness.getCode(),
                    updatedThickness.getName(),
                    updatedThickness.getDeleted()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteThickness(@PathVariable Integer id) throws BadRequestException { // Đổi từ Texture sang Thickness
        try {
            thicknessService.delete(id); // Đổi từ textureService sang thicknessService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Thickness not found with id: " + id); // Đổi từ Texture sang Thickness
        }
    }

    @PostMapping("/save")
    public ResponseEntity<ThicknessResponseDTO> saveThickness(@RequestBody ThicknessRequestDTO requestDTO) { // Đổi từ TextureRequestDTO sang ThicknessRequestDTO
        try {
            Thickness thickness = thicknessService.save(requestDTO); // Đổi từ textureService sang thicknessService

            ThicknessResponseDTO responseDTO = new ThicknessResponseDTO( // Đổi từ TextureResponseDTO sang ThicknessResponseDTO
                    thickness.getCode(),
                    thickness.getName(),
                    thickness.getDeleted()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}