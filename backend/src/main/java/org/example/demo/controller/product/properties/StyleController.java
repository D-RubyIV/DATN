package org.example.demo.controller.product.properties;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.StyleRequestDTO;
import org.example.demo.dto.product.response.properties.StyleResponseDTO;
import org.example.demo.entity.product.properties.Style; // Đổi từ Sleeve sang Style
import org.example.demo.mapper.product.request.properties.StyleRequestMapper; // Đổi từ SleeveRequestMapper sang StyleRequestMapper
import org.example.demo.mapper.product.response.properties.StyleResponseMapper;
import org.example.demo.service.product.properties.StyleService; // Đổi từ SleeveService sang StyleService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequestMapping("style")
public class StyleController {
    @Autowired
    private StyleService styleService; // Đổi từ sleeveService sang styleService
    @Autowired
    private StyleRequestMapper styleRequestMapper; // Đổi từ sleeveRequestMapper sang styleRequestMapper
    @Autowired
    private StyleResponseMapper styleResponseMapper; // Đổi từ sleeveResponseMapper sang styleResponseMapper

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(styleService.findAll(pageable)); // Đổi từ sleeveService sang styleService
    }
    @GetMapping("/style")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(styleService.findAllList());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Style> getStyleDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Sleeve sang Style
        Style style = styleService.findById(id); // Đổi từ sleeveService sang styleService
        if (style == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "StyleDetail not found"); // Đổi từ SleeveDetail sang StyleDetail
        }
        return ResponseEntity.ok(style);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<StyleResponseDTO> updateStyle(
            @PathVariable Integer id,
            @RequestBody StyleRequestDTO requestDTO) { // Đổi từ SleeveRequestDTO sang StyleRequestDTO
        try {
            Style updatedStyle = styleService.update(id, requestDTO); // Đổi từ sleeveService sang styleService

            StyleResponseDTO responseDTO = new StyleResponseDTO( // Đổi từ SleeveResponseDTO sang StyleResponseDTO
                    updatedStyle.getCode(),
                    updatedStyle.getName(),
                    updatedStyle.getDeleted()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteStyle(@PathVariable Integer id) throws BadRequestException { // Đổi từ Sleeve sang Style
        try {
            styleService.delete(id); // Đổi từ sleeveService sang styleService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Style not found with id: " + id); // Đổi từ Sleeve sang Style
        }
    }

    @PostMapping("/save")
    public ResponseEntity<StyleResponseDTO> saveStyle(@RequestBody StyleRequestDTO requestDTO) { // Đổi từ SleeveRequestDTO sang StyleRequestDTO
        try {
            Style style = styleService.save(requestDTO); // Đổi từ sleeveService sang styleService

            StyleResponseDTO responseDTO = new StyleResponseDTO( // Đổi từ SleeveResponseDTO sang StyleResponseDTO
                    style.getCode(),
                    style.getName(),
                    style.getDeleted()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}