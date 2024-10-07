package org.example.demo.service.voucher;


import org.example.demo.dto.staff.response.StaffResponseDTO;
import org.example.demo.dto.voucher.response.VoucherResponseDTO;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.entity.voucher.core.Voucher;
import org.example.demo.infrastructure.common.PageableObject;
import org.example.demo.model.request.VoucherRequest;
import org.example.demo.model.response.VoucherResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface VoucherService {

    List<VoucherResponse> getCustomerVoucher(Integer id, VoucherRequest request);

    List<VoucherResponse> getAll();

    PageableObject<VoucherResponse> getAll(VoucherRequest request);

    VoucherResponse findVoucherById(Integer id);

    Page<Voucher> getAllVouchers(int limit, int offset);

    VoucherResponseDTO getVoucherResponseDTO(Voucher vocher);

    Page<VoucherResponseDTO> findAllByPage(
            String code,
            String name,
            LocalDateTime fromDate,
            LocalDateTime toDate,
            Pageable pageable);

    Voucher addVoucher(VoucherRequest request);

    Page<Voucher> searchVoucher(String keyword, String name, String code, String typeTicket, Integer quantity, Double maxPercent,Double minAmount,String status, int limit, int offset);

    Voucher updateVoucher(Integer id, VoucherRequest request);

    void updateStatusVoucher();

    void deleteVoucher(Integer id);
}
