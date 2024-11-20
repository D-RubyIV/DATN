package org.example.demo.dto.order.core.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created time 9/29/2024 18:07
 * The type Staff response dto.
 *
 * @author PHAH04
 * Vui lòng ......
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CountStatusOrder {
    private Long countAll;
    private Long countPending;
    private Long countToShip;
    private Long countToReceive;
    private Long countDelivered;
    private Long countCancelled;
    private Long countReturned;
}
