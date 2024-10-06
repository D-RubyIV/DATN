package org.example.demo.controller.product.properties;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.ColorRequestDTO;
import org.example.demo.dto.product.response.properties.ColorResponseDTO;
import org.example.demo.entity.product.properties.Color; // Đổi từ Collar sang Color
import org.example.demo.mapper.product.request.properties.ColorRequestMapper; // Đổi từ CollarRequestMapper sang ColorRequestMapper
import org.example.demo.mapper.product.response.properties.ColorResponseMapper;
import org.example.demo.service.product.properties.ColorService; // Đổi từ CollarService sang ColorService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequestMapping("color")
public class ColorController {
    @Autowired
    private ColorService colorService; // Đổi từ collarService sang colorService
    @Autowired
    private ColorRequestMapper colorRequestMapper; // Đổi từ collarRequestMapper sang colorRequestMapper
    @Autowired
    private ColorResponseMapper colorResponseMapper; // Đổi từ collarResponseMapper sang colorResponseMapper

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(colorService.findAll(pageable)); // Đổi từ collarService sang colorService
    }
    @GetMapping("/color")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(colorService.findAllList());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Color> getColorDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Collar sang Color
        Color color = colorService.findById(id); // Đổi từ collarService sang colorService
        if (color == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ColorDetail not found"); // Đổi từ CollarDetail sang ColorDetail
        }
        return ResponseEntity.ok(color);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ColorResponseDTO> updateColor(
            @PathVariable Integer id,
            @RequestBody ColorRequestDTO requestDTO) { // Đổi từ CollarRequestDTO sang ColorRequestDTO
        try {
            Color updatedColor = colorService.update(id, requestDTO); // Đổi từ collarService sang colorService

            ColorResponseDTO responseDTO = new ColorResponseDTO( // Đổi từ CollarResponseDTO sang ColorResponseDTO
                    updatedColor.getCode(),
                    updatedColor.getName(),
                    updatedColor.getDeleted()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteColor(@PathVariable Integer id) throws BadRequestException { // Đổi từ Collar sang Color
        try {
            colorService.delete(id); // Đổi từ collarService sang colorService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Color not found with id: " + id); // Đổi từ Collar sang Color
        }
    }

    @PostMapping("/save")
    public ResponseEntity<ColorResponseDTO> saveColor(@RequestBody ColorRequestDTO requestDTO) { // Đổi từ CollarRequestDTO sang ColorRequestDTO
        try {
            Color color = colorService.save(requestDTO); // Đổi từ collarService sang colorService

            ColorResponseDTO responseDTO = new ColorResponseDTO( // Đổi từ CollarResponseDTO sang ColorResponseDTO
                    color.getCode(),
                    color.getName(),
                    color.getDeleted()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}