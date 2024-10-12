package org.example.demo.dto.customer;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDTO {

    private String code;

    @NotNull(message = "NotNull")
    private String name;

    @NotNull(message = "NotNull")
    @NotBlank(message = "NotBlank")
    private String email;

    @NotNull(message = "NotNull")
    @NotBlank(message = "NotBlank")
    private String phone;

    private String gender;

    @NotNull(message = "NotNull")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDate;

    private String province;

    private String district;

    private String ward;

    @NotNull(message = "NotNull")
    private String detail;

    private String status;

    private LocalDateTime createdDate;

}
