package org.example.demo.dto.response.history;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.bill.core.Bill;
import org.example.demo.entity.bill.enums.Status;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class HistoryResponseDTO {
    @Enumerated(EnumType.STRING)
    private Status status;
    private String note;
    private Bill bills;
}
