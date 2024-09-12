package org.example.demo.service.impl;

import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.voucher.Voucher;
import org.example.demo.enums.TypeTicket;
import org.example.demo.infrastructure.common.AutoGenCode;
import org.example.demo.infrastructure.converted.VoucherConvert;
import org.example.demo.model.request.VoucherRequest;
import org.example.demo.model.response.VoucherResponse;
import org.example.demo.repository.voucher.CustomerRepository;
import org.example.demo.repository.voucher.VoucherRepository;
import org.example.demo.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    public List<VoucherResponse> getCustomerVoucher(Integer id, VoucherRequest request) {
        return voucherRepository.getAllVouchersWithCustomers(id, request);
    }

    @Override
    public List<VoucherResponse> getAll() {
        return voucherRepository.getPublicVoucher();
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

        if (voucherSaved.getTypeTicket() == TypeTicket.Individual) {
            if (!request.getCustomers().isEmpty()) {
                List<Integer> idCustomers = request.getCustomers();
                List<Customer> listCustomers = idCustomers.stream()
                        .map(idCustomer -> {
                            Optional<Customer> customerOptional = customerRepository.findById(idCustomer);
                            return customerOptional.orElseThrow(() ->
                                    new RuntimeException("Customer not found: " + idCustomer));
                        })
                        .collect(Collectors.toList());
                voucherSaved.setCustomers(listCustomers);
                voucherSaved = voucherRepository.save(voucherSaved);
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
