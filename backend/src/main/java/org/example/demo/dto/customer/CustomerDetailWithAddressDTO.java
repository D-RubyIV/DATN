package org.example.demo.dto.customer;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDetailWithAddressDTO {
    private int id;

    private String code;

    private String name;

    private String email;

    private String phone;

    private String gender;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDate;

    private Page<AddressDTO> addressDTOPage;
}
