package org.example.demo.dto.order.core.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.order.enums.Type;

import java.time.LocalDateTime;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa =))
 */

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderOverviewResponseDTO {
    private Integer id;
    private String code;
    private String address;
    private String phone;
    private Boolean deleted;
    @JsonFormat(pattern = "dd-MM-yyyy", shape = JsonFormat.Shape.STRING)
    private LocalDateTime createdDate;
    @Enumerated(EnumType.STRING)
    private Status status;
    @Enumerated(EnumType.STRING)
    private Type type;
    private Double total;
    private Double subTotal;
    private String customerName;
    private String staffName;
}
