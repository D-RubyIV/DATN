package org.example.demo.dto.voucher.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class VoucherResponseDTO {
    private String code;

    private String name;

    private Integer quantity;

    private Integer minAmount;

    private Integer maxPercent;

    private String typeTicket;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate startDate;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate endDate;

    private Boolean deleted;
}
