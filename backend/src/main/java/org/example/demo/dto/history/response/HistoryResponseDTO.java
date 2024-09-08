package org.example.demo.dto.history.response;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.bill.response.BillResponseDTO;
import org.example.demo.entity.bill.enums.Status;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class HistoryResponseDTO {
    private Integer id;
    @Enumerated(EnumType.STRING)
    private Status status;
    private String note;
}
