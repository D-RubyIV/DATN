package org.example.controller;

import org.example.demo.entity.voucher.Voucher;
import org.example.model.request.VoucherRequest;
import org.example.model.response.VoucherResponse;
import org.example.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/voucher")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

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

}
