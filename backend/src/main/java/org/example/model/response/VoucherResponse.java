package org.example.model.response;

import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.voucher.Voucher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.LocalDate;
import java.util.List;

@Projection(types = {Customer.class, Voucher.class})
public interface VoucherResponse {

    @Value("#{target.Id}")
    Integer getId();

    @Value("#{target.name}")
    String getName();

    @Value("#{target.code}")
    String getCode();

    @Value("#{targer.startDate}")
    LocalDate getStartDate();

    @Value("#{target.endDate}")
    LocalDate getEndDate();

    @Value("#{target.status}")
    String getStatus();

    @Value("#{target.quantity}")
    Long getQuantity();

    @Value("#{target.maxDiscount}")
    Integer getMaxDiscount();

    @Value("#{target.minTotal}")
    Double getMinTotal();

    @Value("#{target.typeTicket}")
    String getTypeVoucher();


    // Thông tin khách hàng
    List<CustomerResponse> getCustomers();

    @Projection(types = Customer.class)
    interface CustomerResponse {

        @Value("#{target.id}")
        Integer getCustomerId();

        @Value("#{target.name}")
        String getCustomerName();

        @Value("#{target.email}")
        String getCustomerEmail();
    }

}


