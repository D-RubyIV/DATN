package org.example.service.impl;

import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.voucher.Voucher;
import org.example.enums.TypeVoucher;
import org.example.infrastructure.common.AutoGenCode;
import org.example.infrastructure.converted.VoucherConvert;
import org.example.model.request.VoucherRequest;
import org.example.model.response.VoucherResponse;
import org.example.repository.CustomerRepository;
import org.example.repository.VoucherRepository;
import org.example.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class VoucherServiceImpl implements VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private VoucherConvert voucherConvert;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AutoGenCode autoGenCode;


    @Override
    public List<VoucherResponse> getAll() {
        return voucherRepository.getAllVoucher();
    }

    @Override
    public VoucherResponse findVoucherById(Integer id) {
        Optional<VoucherResponse> voucherOptional = voucherRepository.findVoucherById(id);
        return voucherOptional.orElse(null);
    }

    @Override
    public Voucher addVoucher(VoucherRequest request) {
        if (request.getCode() == null || request.getCode().isEmpty()) {
            request.setCode(autoGenCode.genarateUniqueCode());
        }

        Voucher voucher = voucherConvert.convertRequestToEntity(request);
        Voucher voucherSaved = voucherRepository.save(voucher);
        updateStatus(voucherSaved);

        if (voucher.getTypeTicket() == TypeVoucher.Individual) {
            List<Customer> customers = voucher.getCustomers();
            for (Customer customer : customers) {
                // Ví dụ: Gửi thông báo hoặc thực hiện một hành động khác
                // gui mail
            }
        }
        return voucherSaved;
    }


    @Override
    public Voucher updateVoucher(Integer id, VoucherRequest request) {
        Optional<Voucher> optionalVoucher = voucherRepository.findById(id);
        if (optionalVoucher.isEmpty()) {
            throw new RuntimeException("Voucher with ID not found: " + id);
        }
        Voucher voucher = voucherConvert.convertRequestToEntity(id, request);
        updateStatus(voucher);
        return voucherRepository.save(voucher);
    }

    @Override
    public void updateStatusVoucher() {
        List<Voucher> vouchers = voucherRepository.findAll();
        for (Voucher voucher : vouchers) {
            if (voucher.getQuantity() == 0) {
                voucher.setStatus("Expired");
            } else {
               updateStatus(voucher);
            }
            voucherRepository.save(voucher);
        }
    }

    @Override
    public void deleteVoucher(Integer id) {
        Optional<Voucher> optionalVoucher = voucherRepository.findById(id);
        if (optionalVoucher.isEmpty()) {
            throw new RuntimeException("Voucher with ID not found: " + id);
        }
        Voucher voucher = optionalVoucher.get();
        voucher.setDeleted(true);
        voucherRepository.save(voucher);
    }

    public void updateStatus(Voucher voucher) {
        LocalDate currentDate = LocalDate.now();
        LocalDate startDate = voucher.getStartDate();
        LocalDate endDate = voucher.getEndDate();

        if (currentDate.isBefore(startDate)) {
            voucher.setStatus("Not started yet");
        } else if (currentDate.isAfter(startDate) && currentDate.isBefore(endDate)) {
            voucher.setStatus("In progress");
        } else {
            voucher.setStatus("Expired");
        }
        voucherRepository.save(voucher);
    }
}
