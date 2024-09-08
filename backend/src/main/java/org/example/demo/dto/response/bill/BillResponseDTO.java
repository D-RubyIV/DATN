package org.example.demo.dto.response.bill;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.bill.properties.History;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BillResponseDTO {
    private String code;
    private String name;
    private String address;
    private String phone;
    private Boolean deleted;
    private Double total;
    private Double subTotal;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate orderDate;
    private List<History> histories;
}
