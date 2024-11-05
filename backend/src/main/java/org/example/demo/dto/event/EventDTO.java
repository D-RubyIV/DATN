package org.example.demo.dto.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.product.properties.Product;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventDTO {

    private Integer id;

    private String discountCode;

    private String name; // tên sự kiện

    private Integer discountPercent; // phần trăm giảm giá

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endDate;

    private Integer quantityDiscount; // so luong phai tinh dua tren san pham dc chon

    private List<String> productCodes; // danh sach ma sp dc chon
}
