package org.example.demo.dto.customer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressDTO {

    private int id;

    private String name;

    private String phone;

    private String province;

    private String district;

    private String ward;

    private String detail;

    private Boolean isDefault;

}
