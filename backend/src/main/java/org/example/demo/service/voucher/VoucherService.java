package org.example.demo.service.voucher;


import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.infrastructure.common.PageableObject;
import org.example.demo.model.request.VoucherRequest;
import org.example.demo.model.response.VoucherResponse;

import java.util.List;

public interface VoucherService {

    List<VoucherResponse> getCustomerVoucher(Integer id, VoucherRequest request);
    List<VoucherResponse> getAll();

    PageableObject<VoucherResponse> getAll(VoucherRequest request);
    VoucherResponse findVoucherById(Integer id);

    Voucher addVoucher(VoucherRequest request);

    Voucher updateVoucher(Integer id, VoucherRequest request);

    void updateStatusVoucher();

    void deleteVoucher(Integer id);
}
