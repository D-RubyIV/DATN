package org.example.demo.controller.product.properties;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.CollarRequestDTO;
import org.example.demo.dto.product.response.properties.CollarResponseDTO;
import org.example.demo.entity.product.properties.Collar; // Đổi từ Brand sang Collar
import org.example.demo.mapper.product.request.properties.CollarRequestMapper; // Đổi từ BrandRequestMapper sang CollarRequestMapper
import org.example.demo.mapper.product.response.properties.CollarResponseMapper;
import org.example.demo.service.product.properties.CollarService; // Đổi từ BrandService sang CollarService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequestMapping("collar")
public class CollarController {
    @Autowired
    private CollarService collarService; // Đổi từ brandService sang collarService
    @Autowired
    private CollarRequestMapper collarRequestMapper; // Đổi từ brandRequestMapper sang collarRequestMapper
    @Autowired
    private CollarResponseMapper collarResponseMapper; // Đổi từ brandResponseMapper sang collarResponseMapper

    @GetMapping("")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(collarService.findAll(pageable)); // Đổi từ brandService sang collarService
    }

    @GetMapping("/collar")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(collarService.findAllList());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Collar> getCollarDetailById(@PathVariable Integer id) throws BadRequestException { // Đổi từ Brand sang Collar
        Collar collar = collarService.findById(id); // Đổi từ brandService sang collarService
        if (collar == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "CollarDetail not found"); // Đổi từ BrandDetail sang CollarDetail
        }
        return ResponseEntity.ok(collar);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CollarResponseDTO> updateCollar(
            @PathVariable Integer id,
            @RequestBody CollarRequestDTO requestDTO) { // Đổi từ BrandRequestDTO sang CollarRequestDTO
        try {
            Collar updatedCollar = collarService.update(id, requestDTO); // Đổi từ brandService sang collarService

            CollarResponseDTO responseDTO = new CollarResponseDTO( // Đổi từ BrandResponseDTO sang CollarResponseDTO
                    updatedCollar.getCode(),
                    updatedCollar.getName(),
                    updatedCollar.getDeleted()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCollar(@PathVariable Integer id) throws BadRequestException { // Đổi từ Brand sang Collar
        try {
            collarService.delete(id); // Đổi từ brandService sang collarService
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new BadRequestException("Collar not found with id: " + id); // Đổi từ Brand sang Collar
        }
    }

    @PostMapping("/save")
    public ResponseEntity<CollarResponseDTO> saveCollar(@RequestBody CollarRequestDTO requestDTO) { // Đổi từ BrandRequestDTO sang CollarRequestDTO
        try {
            Collar collar = collarService.save(requestDTO); // Đổi từ brandService sang collarService

            CollarResponseDTO responseDTO = new CollarResponseDTO( // Đổi từ BrandResponseDTO sang CollarResponseDTO
                    collar.getCode(),
                    collar.getName(),
                    collar.getDeleted()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}