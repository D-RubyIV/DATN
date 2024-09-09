package org.example.demo.infrastructure.converted;

import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.voucher.Voucher;
import org.example.demo.model.request.VoucherRequest;
import org.example.demo.repository.voucher.CustomerRepository;
import org.example.demo.repository.voucher.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class VoucherConvert {

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public Voucher convertRequestToEntity(VoucherRequest request) {
        List<Customer> customerList = customerRepository.findAllById(
                request.getCustomers()
        );

        return Voucher.builder()
                .code(request.getCode())
                .name(request.getName())
                .quantity(request.getQuantity())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(request.getStatus())
                .typeTicket(request.getTypeTicket())
                .deleted(false)
                .maxPercent(request.getMaxPercent())
                .minAmount(request.getMinAmount())
                .customers(customerList)
                .build();
    }

    public Voucher convertRequestToEntity(Integer id, VoucherRequest request) {
        Optional<Voucher> optionalVoucher = voucherRepository.findById(id);
        if (optionalVoucher.isEmpty()) {
            throw new RuntimeException("Voucher with ID not found: " + id);
        }

        Voucher voucher = optionalVoucher.get();
        voucher.setCode(request.getCode());
        voucher.setName(request.getName());
        voucher.setStatus(request.getStatus());
        voucher.setQuantity(request.getQuantity());
        voucher.setMinAmount(request.getMinAmount());
        voucher.setMaxPercent(request.getMaxPercent());
        voucher.setStartDate(request.getStartDate());
        voucher.setEndDate(request.getEndDate());
        voucher.setTypeTicket(request.getTypeTicket());
        voucher.setDeleted(request.getDeleted());

        List<Customer> customers = customerRepository.findAllById(request.getCustomers());
        voucher.setCustomers(customers);

        return voucher;
    }
}
