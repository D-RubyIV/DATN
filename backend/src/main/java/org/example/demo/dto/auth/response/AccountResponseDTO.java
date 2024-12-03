package org.example.demo.dto.auth.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.human.role.Role;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AccountResponseDTO {

    private String username;
    private String status;
    private Boolean enabled;
    private String roleName;
    private Role role;
    private String provider;
    private String socialId;
}
