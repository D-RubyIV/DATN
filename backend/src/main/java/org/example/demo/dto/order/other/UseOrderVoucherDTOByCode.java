package org.example.demo.dto.order.other;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UseOrderVoucherDTOByCode {
    @NotNull(message = "NotNull")
    private Integer idOrder;
    @NotNull(message = "NotNull")
    private String codeVoucher;
}