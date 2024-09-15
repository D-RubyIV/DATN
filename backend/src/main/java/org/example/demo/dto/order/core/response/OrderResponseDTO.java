package org.example.demo.dto.order.core.response;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.customer.response.CustomerResponseDTO;
import org.example.demo.dto.history.response.HistoryResponseDTO;
import org.example.demo.dto.order.properties.response.OrderDetailResponseDTO;
import org.example.demo.dto.staff.response.phah04.StaffResponseDTO;
import org.example.demo.dto.voucher.response.VoucherResponseDTO;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.order.enums.Type;

import java.util.List;
/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa =))
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderResponseDTO {
    private Integer id;
    private String code;
    private String address;
    private String phone;
    private Boolean deleted;
    @Enumerated(EnumType.STRING)
    private Status status;
    @Enumerated(EnumType.STRING)
    private Type type;
    private Double total;
    private Double subTotal;
    private CustomerResponseDTO customerResponseDTO;
    private StaffResponseDTO staffResponseDTO;
    private VoucherResponseDTO voucherResponseDTO;
    private List<OrderDetailResponseDTO> orderDetailResponseDTOS;
    private List<HistoryResponseDTO> historyResponseDTOS;
}
