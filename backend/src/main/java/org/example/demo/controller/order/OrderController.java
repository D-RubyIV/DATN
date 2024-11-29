package org.example.demo.controller.order;

import jakarta.validation.Valid;
import org.example.demo.controller.IControllerBasic;
import org.example.demo.dto.history.request.HistoryRequestDTO;
import org.example.demo.dto.order.core.request.OrderRequestDTO;
import org.example.demo.dto.order.core.response.CountStatusOrder;
import org.example.demo.dto.order.core.response.OrderOverviewResponseDTO;
import org.example.demo.dto.order.core.response.OrderResponseDTO;
import org.example.demo.dto.order.other.UseOrderVoucherDTOByCode;
import org.example.demo.dto.order.other.UseOrderVoucherDTOById;
import org.example.demo.mapper.order.core.response.OrderResponseMapper;
import org.example.demo.model.response.ICountOrderDetailInOrder;
import org.example.demo.service.order.OrderService;
import org.example.demo.service.pdf.OrderPdfService;
import org.example.demo.util.phah04.PageableObject;
import org.example.demo.validate.group.GroupCreate;
import org.example.demo.validate.group.GroupUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;


/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa =))
 */
@RestController
@RequestMapping(value = "orders")
public class OrderController implements IControllerBasic<Integer, OrderRequestDTO> {
    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderResponseMapper orderResponseMapper;
    @Autowired
    private OrderPdfService orderPdfService;

    @RequestMapping(value = "overview")
    public ResponseEntity<Page<OrderOverviewResponseDTO>> findAllByPageV2(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "createdFrom", required = false) LocalDateTime createdFrom,
            @RequestParam(value = "createdTo", required = false) LocalDateTime createdTo,
            @Valid @RequestBody PageableObject pageableObject,
            BindingResult bindingResult
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        String query = pageableObject.getQuery();
        return ResponseEntity.ok(orderService.findAllOverviewByPage(status, type, createdFrom, createdTo, pageableObject));
    }

    @Override
    @PostMapping(value = "")
    public ResponseEntity<OrderResponseDTO> create(@Validated(GroupCreate.class) @RequestBody OrderRequestDTO billResponseDTO) {
        return ResponseEntity.ok(orderResponseMapper.toDTO(orderService.save(billResponseDTO)));
    }

    @Override
    @PutMapping(value = {"{id}"})
    public ResponseEntity<OrderResponseDTO> update(@PathVariable Integer id, @Validated(GroupUpdate.class) @RequestBody OrderRequestDTO orderRequestDTO) {
        return ResponseEntity.ok(orderResponseMapper.toDTO(orderService.update(id, orderRequestDTO)));

    }

    @Override
    @DeleteMapping(value = "{id}")
    public ResponseEntity<OrderResponseDTO> delete(@PathVariable Integer id) {
        return ResponseEntity.ok(orderResponseMapper.toDTO(orderService.delete(id)));
    }

    @Override
    @GetMapping(value = "{id}")
    public ResponseEntity<OrderResponseDTO> detail(@PathVariable Integer id) {
        return ResponseEntity.ok(orderResponseMapper.toDTO(orderService.findById(id)));
    }

    @GetMapping(value = "by-code/{code}")
    public ResponseEntity<OrderResponseDTO> detailByCode(@PathVariable String code) {
        return ResponseEntity.ok(orderResponseMapper.toDTO(orderService.findByCode(code)));
    }

    @PutMapping(value = "status/change/{id}")
    public ResponseEntity<OrderResponseDTO> changeStatus(@PathVariable Integer id, @RequestBody HistoryRequestDTO requestDTO) {
        return ResponseEntity.ok(orderResponseMapper.toDTO(orderService.changeStatus(id, requestDTO)));
    }

    @PostMapping(value = "use-voucher-by-id")
    public ResponseEntity<OrderResponseDTO> addVoucherById(@Valid @RequestBody UseOrderVoucherDTOById requestDTO) {
        return ResponseEntity.ok(orderResponseMapper.toDTO(orderService.addVoucherById(requestDTO)));
    }

    @PostMapping(value = "use-voucher-by-code")
    public ResponseEntity<OrderResponseDTO> addVoucherByCode(@Valid @RequestBody UseOrderVoucherDTOByCode requestDTO) {
        return ResponseEntity.ok(orderResponseMapper.toDTO(orderService.addVoucherCode(requestDTO)));
    }

    @GetMapping(value = "re-calculate/{id}")
    public ResponseEntity<?> calculateAgain(@PathVariable Integer id) {
        return ResponseEntity.ok(orderResponseMapper.toDTO(orderService.callReCalculate(id)));
    }

    @GetMapping(value = "calculate-fee/{id}")
    public ResponseEntity<?> calculateFee(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.calculateFee(id));
    }

    // OTHER
    @GetMapping(value = "count-any-status")
    public ResponseEntity<CountStatusOrder> getCountAnyStatus(@RequestParam(value = "type", required = false) String type) {
        return ResponseEntity.ok(orderService.getCountStatusAnyOrder(type));
    }

    @GetMapping(value = "count-order-detail")
    public ResponseEntity<List<ICountOrderDetailInOrder>> getCountOrder(@RequestParam("ids") List<Integer> ids) {
        return ResponseEntity.ok(orderService.getCountOrderDetailInOrder(ids));
    }

    @GetMapping("/exportPdf/{idOrder}")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Integer idOrder) {
        ByteArrayOutputStream pdfStream = orderPdfService.export(idOrder);
        if (pdfStream == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        byte[] pdfBytes = pdfStream.toByteArray();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    @GetMapping(value = "convert/{id}")
    public ResponseEntity<?> convert(@PathVariable Integer id) {
        return ResponseEntity.ok(orderResponseMapper.toDTO(orderService.convertCartToOrder(id)));
    }
}
