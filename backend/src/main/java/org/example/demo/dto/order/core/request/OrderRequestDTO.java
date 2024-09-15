package org.example.demo.dto.order.core.request;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.human.customer.Customer;
import org.example.demo.entity.voucher.core.Voucher;
import org.hibernate.validator.constraints.Length;
/**
 * The type Staff response dto.
 * BY PHAH04
 * Vui lòng không chỉnh sửa, có sửa hãy copy =))
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderRequestDTO {

    @Length(message = "Length-4-8", min = 4, max = 8)
    @NotNull(message = "NotNull")
    @NotBlank(message = "NotBlank")
    private String code;

    @Length(message = "Length-5-25", min = 5, max = 25)
    @NotNull(message = "NotNull")
    @NotBlank(message = "NotBlank")
    private String address;

    @Length(message = "Length-5-25", min = 5, max = 25)
    @NotNull(message = "NotNull")
    @NotBlank(message = "NotBlank")
    private String phone;

    private Boolean deleted;

    @Enumerated(EnumType.STRING)
    private Status status;

    @NotNull(message = "NotNull")
    private Double total;

    @NotNull(message = "NotNull")
    private Double subTotal;


    private Voucher voucher;

    @NotNull(message = "NotNull")
    private Customer customer;
}
