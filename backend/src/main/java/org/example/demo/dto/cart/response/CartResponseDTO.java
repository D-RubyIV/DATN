package org.example.demo.dto.cart.response;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.cart.enums.Status;
import org.example.demo.entity.human.staff.Staff;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CartResponseDTO {
    @Enumerated(EnumType.STRING)
    private Status status;
    private Staff staff;
}
