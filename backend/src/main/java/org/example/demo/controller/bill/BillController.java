package org.example.demo.controller.bill;

import org.example.demo.mapper.bill.request.BillRequestMapper;
import org.example.demo.mapper.bill.response.BillResponseMapper;
import org.example.demo.service.bill.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("bill")
public class BillController {
    @Autowired
    private BillService billService;

    @Autowired
    private BillRequestMapper billRequestMapper;

    @Autowired
    private BillResponseMapper billResponseMapper;

    @GetMapping(value = "")
    public ResponseEntity<?> findAll(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(billService.findAll(pageable));
    }

    @GetMapping(value = "v2")
    public ResponseEntity<?> findAlV2(
            @PageableDefault(page = 0, size = 5) Pageable pageable
    ) {
        return ResponseEntity.ok(billService.findAll(pageable));
    }
}
