package org.example.demo.controller.voucher;


import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.infrastructure.common.PageableObject;
import org.example.demo.model.request.VoucherRequest;
import org.example.demo.model.response.VoucherResponse;
import org.example.demo.service.VoucherService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/voucher")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    @GetMapping("/private/{id}")
    public ResponseEntity<List<VoucherResponse>> getCustomerVoucher(@PathVariable Integer id,VoucherRequest request){
        return ResponseEntity.ok().body(voucherService.getCustomerVoucher(id,request));
    }

    @GetMapping
    public PageableObject getAll(final VoucherRequest request){
        return voucherService.getAll(request);
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

}
