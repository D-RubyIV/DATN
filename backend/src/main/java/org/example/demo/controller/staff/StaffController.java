package org.example.demo.controller.staff;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.dto.staff.response.StaffResponseDTO;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.service.staff.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/staffs")
public class StaffController {

    private final StaffService staffService;

    @Autowired
    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    public ResponseEntity<Page<StaffResponseDTO>> getAllNhanVien(
            @RequestParam(name = "limit", defaultValue = "5") int limit,
            @RequestParam(name = "offset", defaultValue = "0") int offset) {
        Page<Staff> result = staffService.getAllStaffs(limit, offset);
        Page<StaffResponseDTO> response = result.map(staffService::getStaffResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<StaffResponseDTO>> searchNhanVien(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String name, // hoTen
            @RequestParam(required = false) String phone, // sdt
            @RequestParam(required = false) String code, // ma
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String status, // trangThai
            @RequestParam(required = false) String citizenId, // cccd
            @PageableDefault(size = 5) Pageable pageable) {

        // Log incoming parameters for debugging (optional)
        System.out.println("Searching staff with parameters: " +
                "keyword=" + keyword + ", fullName=" + name + ", phone=" + phone +
                ", code=" + code + ", email=" + email + ", status=" + status +
                ", citizenId=" + citizenId);


        Page<Staff> result = staffService.searchNhanVien(
                keyword, name, phone, code, email, status, citizenId,
                pageable.getPageSize(), (int) pageable.getOffset());

        Page<StaffResponseDTO> response = result.map(staffService::getStaffResponseDTO);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{id}")
    public ResponseEntity<StaffResponseDTO> getStaffById(@PathVariable Integer id) {
        try {
            StaffResponseDTO staffResponseDTO = staffService.getStaffResponseDTO(staffService.findById(id));
            return ResponseEntity.ok(staffResponseDTO);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Staff not found with id " + id, e);
        }
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<Void> updateStaffStatus(@PathVariable Integer id, @RequestBody Map<String, String> updates) {
        String newStatus = updates.get("status");
        if (newStatus == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status must be provided");
        }
        try {
            staffService.updateStatus(id, newStatus);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status value", e);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Staff not found with id " + id, e);
        }
    }

    @PostMapping
    public ResponseEntity<StaffResponseDTO> createStaff(@Valid @RequestBody StaffRequestDTO requestDTO) {
        try {
            Staff savedStaff = staffService.save(requestDTO);
            StaffResponseDTO staffResponse = staffService.getStaffResponseDTO(savedStaff);
            return ResponseEntity.status(HttpStatus.CREATED).body(staffResponse);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid request data", e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffResponseDTO> updateStaff(
            @PathVariable Integer id,
            @Valid @RequestBody StaffRequestDTO requestDTO) {
        try {
            StaffResponseDTO updatedStaffResponseDTO = staffService.update(id, requestDTO);
            return ResponseEntity.ok(updatedStaffResponseDTO);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Staff not found with id " + id, e);
        }
    }

    @PostMapping("/upload-excel")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty() || !file.getContentType().equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid file format or empty file");
        }

        try {
            staffService.importFromExcel(file);
            return ResponseEntity.ok("File uploaded and data imported successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while reading file");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("Unable to upload file");
        }
    }


}