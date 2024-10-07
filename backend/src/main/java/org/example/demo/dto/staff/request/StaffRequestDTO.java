package org.example.demo.dto.staff.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.human.role.Role;

import java.time.LocalDateTime;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class StaffRequestDTO {

    private Integer id;

    //    @Size(message = "Length-5-50", min = 5, max = 50)
//    @NotNull(message = "NotNull")
//    @NotBlank(message = "NotBlank")
    private String code;

    //    @Size(message = "Length-5-25", min = 5, max = 25)
//    @NotNull(message = "NotNull")
//    @NotBlank(message = "NotBlank")
    private String name;

    //    @Email(message = "Invalid email format")
//    @NotNull(message = "NotNull")
//    @NotBlank(message = "NotBlank")
    private String email;

    //    @Size(message = "Length-10-15", min = 10, max = 15)
//    @NotNull(message = "NotNull")
//    @NotBlank(message = "NotBlank")
    private String phone;

    //    @NotNull(message = "NotNull")
    private String password;

    //    @Size(message = "Length-5-20", min = 5, max = 20)
    private String citizenId;

    private String address;
    private String province;
    private String district;
    private String ward;
    private String note;

    private Boolean deleted; // Consider setting this to false by default in the service
    private Boolean gender;

    private LocalDateTime birthDay;

    //    @NotNull(message = "NotNull")
    private Role role; // Assume Role is included directly, or you might want to use roleId instead
}

