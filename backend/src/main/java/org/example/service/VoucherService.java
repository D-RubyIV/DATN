package org.example.service;


import org.example.demo.entity.voucher.Voucher;
import org.example.model.request.VoucherRequest;
import org.example.model.response.VoucherResponse;

import java.util.List;

public interface VoucherService {

    List<VoucherResponse> getAll();

    VoucherResponse findVoucherById(Integer id);

    Voucher addVoucher(VoucherRequest request);

    Voucher updateVoucher(Integer id, VoucherRequest request);

    void updateStatusVoucher();

    void deleteVoucher(Integer id);
}
