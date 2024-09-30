package org.example.demo.model.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.demo.infrastructure.common.PageableRequest;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class VoucherRequest extends PageableRequest {

    @NotNull(message = "Code must not be empty!")
    private String code;

    @NotNull(message = "Name must not be empty!")
    private String name;

    @NotNull(message = "Quantity must not be empty!")
    private Integer quantity;

    @NotNull(message = "Status must not be empty!")
    private String status;

    @NotNull(message = "Min amount must not be empty!")
    private Integer minAmount;

    @NotNull(message = "Max percent must not be empty!")
    private Integer maxPercent;

    @NotNull(message = "Please select the voucher type!")
    private TypeTicket typeTicket;

    @NotNull(message = "Start date must not be empty!")
    private LocalDate startDate;

    @NotNull(message = "End date must not be empty!")
    private LocalDate endDate;

    private Boolean deleted = false;

    private List<Integer> customers;
}
