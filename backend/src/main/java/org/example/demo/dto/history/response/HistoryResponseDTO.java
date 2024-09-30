package org.example.demo.dto.history.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.order.enums.Status;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa =))
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class HistoryResponseDTO {
    private Integer id;
    @Enumerated(EnumType.STRING)
    private Status status;
    private String note;
    private String createdBy;
    @JsonFormat(pattern = "dd-MM-yyyy hh-mm-ss", shape = JsonFormat.Shape.STRING)
    private LocalDateTime createdDate;
    @JsonFormat(pattern = "dd-MM-yyyy hh-mm-ss", shape = JsonFormat.Shape.STRING)
    private LocalDateTime updatedDate;
}
