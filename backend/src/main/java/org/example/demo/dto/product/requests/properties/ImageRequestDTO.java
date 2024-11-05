package org.example.demo.dto.product.requests.properties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ImageRequestDTO {
    private String code;
    private String url;
    private Boolean deleted;



}
