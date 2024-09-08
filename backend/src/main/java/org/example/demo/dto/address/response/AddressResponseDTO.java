package org.example.demo.dto.address.response;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AddressResponseDTO {
    @Column(name = "phone")
    private String phone;

    @Column(name = "detail")
    private String detail;
}
