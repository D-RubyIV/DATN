package org.example.demo.controller.staff;

import jakarta.validation.Valid;
import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.dto.staff.response.StaffResponseDTO;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.service.staff.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

//@CrossOrigin("*")
@RestController
@RequestMapping("/staffs")
@CrossOrigin(origins = "http://localhost:5173")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @GetMapping("/page")
    public ResponseEntity<Page<StaffResponseDTO>> getAllStaff(
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "fromDate", required = false) LocalDate fromDate,
            @RequestParam(value = "toDate", required = false) LocalDate toDate,
            Pageable pageable) {

        Page<StaffResponseDTO> staffPage = staffService.findAllByPage(code, name, fromDate, toDate, pageable);
        return ResponseEntity.ok(staffPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffResponseDTO> getStaffById(@PathVariable Integer id) {
        try {
            Staff staff = staffService.findById(id);
            StaffResponseDTO staffResponse = staffService.getStaffResponseDTO(staff);
            return ResponseEntity.ok(staffResponse);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Staff not found", e);
        }
    }

    @PostMapping
    public ResponseEntity<StaffResponseDTO> createStaff(@Valid @RequestBody StaffRequestDTO requestDTO) {
        try {
            Staff savedStaff = staffService.save(requestDTO);
            StaffResponseDTO staffResponse = staffService.getStaffResponseDTO(savedStaff);
            return ResponseEntity.status(HttpStatus.CREATED).body(staffResponse);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid request", e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Integer id) {
        try {
            staffService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Staff not found", e);
        }
    }
}
