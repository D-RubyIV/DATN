package org.example.demo.dto.auth.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AccountResponseDTO {

    private String username;
    private String status;
    private Boolean enabled;
    private String roleName;
    private String provider;
    private String socialId;
}
