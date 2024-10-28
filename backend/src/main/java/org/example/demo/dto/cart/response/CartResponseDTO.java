package org.example.demo.dto.cart.response;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.cart.enums.Status;
import org.example.demo.entity.human.staff.Staff;

/**
 * The type Staff response dto.
 * BY PHAH04
 * Vui lòng không chỉnh sửa, có sửa hãy copy =))
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CartResponseDTO {
    @Enumerated(EnumType.STRING)
    private Status status;
    private Staff staff;
}
