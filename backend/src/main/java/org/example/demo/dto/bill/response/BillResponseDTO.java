package org.example.demo.dto.bill.response;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.dto.customer.response.CustomerResponseDTO;
import org.example.demo.dto.history.response.HistoryResponseDTO;
import org.example.demo.dto.staff.response.StaffResponseDTO;
import org.example.demo.dto.voucher.response.VoucherResponseDTO;
import org.example.demo.entity.bill.enums.Status;
import org.example.demo.entity.bill.enums.Type;

import java.util.List;
/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa =))
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class BillResponseDTO {
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
    private List<HistoryResponseDTO> historyResponseDTOS;
}
