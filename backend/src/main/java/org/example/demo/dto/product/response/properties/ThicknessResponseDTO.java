package org.example.demo.dto.product.response.properties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ThicknessResponseDTO {
    private String code;
    private String name;
    private Boolean deleted;
}