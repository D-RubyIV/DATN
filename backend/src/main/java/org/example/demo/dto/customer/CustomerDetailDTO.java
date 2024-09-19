package org.example.demo.dto.customer;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
@Data
public class CustomerDetailDTO {

    private int id;

    private String code;

    private String name;

    private String email;

    private String phone;

    private String gender;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDate;

    private String status;

    private List<AddressDTO> addressDTOS;
}
