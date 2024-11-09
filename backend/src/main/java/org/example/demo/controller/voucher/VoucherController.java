package org.example.demo.controller.voucher;


import org.example.demo.dto.voucher.response.VoucherResponseDTO;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.mapper.voucher.response.VoucherResponseMapper;
import org.example.demo.model.request.VoucherRequest;
import org.example.demo.model.response.VoucherResponse;
import org.example.demo.service.voucher.VoucherService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;


@RestController
@RequestMapping(value = "voucher")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private VoucherResponseMapper voucherResponseMapper;

    @GetMapping("/private/{id}")
    public ResponseEntity<List<VoucherResponse>> getCustomerVoucher(@PathVariable Integer id, VoucherRequest request) {
        return ResponseEntity.ok().body(voucherService.getCustomerVoucher(id, request));
    }
    @GetMapping
    public ResponseEntity<Page<VoucherResponseDTO>> getAllNhanVien(
            @RequestParam(name = "limit", defaultValue = "5") int limit,
            @RequestParam(name = "offset", defaultValue = "0") int offset) {
        Page<Voucher> result = voucherService.getAllVouchers(limit, offset);
        Page<VoucherResponseDTO> response = result.map(voucherService::getVoucherResponseDTO);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/page")
    public ResponseEntity<Page<VoucherResponseDTO>> searchNhanVien(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String typeTicket,
            @RequestParam(required = false) Integer quantity,
            @RequestParam(required = false) Double maxPercent,
            @RequestParam(required = false) Double minAmount,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 5) Pageable pageable) {

        // Ensure the service layer can handle the status filtering
        Page<Voucher> result = voucherService.searchVoucher(
                keyword, name, typeTicket, code, quantity, maxPercent,minAmount,status,
                pageable.getPageSize(), (int) pageable.getOffset());

        Page<VoucherResponseDTO> response = result.map(voucherService::getVoucherResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<VoucherResponse>> getAll() {
        List<VoucherResponse> fetchVoucher = this.voucherService.getAll();
        return ResponseEntity.ok().body(fetchVoucher);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VoucherResponse> getVoucherById(@PathVariable Integer id) {
        VoucherResponse voucherResponse = voucherService.findVoucherById(id);
        if (voucherResponse != null) {
            return ResponseEntity.ok(voucherResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addVoucher(@RequestBody VoucherRequest request) {
        voucherService.addVoucher(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Add voucher successfully");
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateVoucher(@PathVariable Integer id, @RequestBody VoucherRequest request) {
        Voucher updateVoucher = voucherService.updateVoucher(id, request);
        if (updateVoucher == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Voucher not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Update voucher successfully");
    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<?> deleteVoucher(@PathVariable Integer id) {
        try {
            voucherService.deleteVoucher(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Voucher not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Delete voucher successfully");
    }

    @GetMapping("/better-voucher")
    public ResponseEntity<?> findBetterVoucher(@RequestParam("amount") BigDecimal amount){
        return ResponseEntity.ok(voucherResponseMapper.toListDTO(voucherService.findBetterVoucher(amount)));
    }
}
