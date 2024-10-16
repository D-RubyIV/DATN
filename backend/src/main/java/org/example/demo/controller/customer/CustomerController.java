package org.example.demo.controller.customer;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.customer.AddressDTO;
import org.example.demo.dto.customer.CustomerDTO;
import org.example.demo.dto.customer.CustomerListDTO;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.service.customer.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/search")
    public ResponseEntity<Page<CustomerListDTO>> getCustomersSearch(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<CustomerListDTO> customerDTOS = customerService.search(query, pageable);
        return ResponseEntity.ok(customerDTOS);
    }

    @GetMapping
    public ResponseEntity<Page<CustomerListDTO>> getCustomers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String status
    ) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<CustomerListDTO> customerDTOS = customerService.getAllCustomers(status, pageable);
        return ResponseEntity.ok(customerDTOS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerDetailById(@PathVariable("id") Integer id) {
        CustomerDTO customerDTO = customerService.getCustomerDetailById(id);
        return ResponseEntity.ok(customerDTO);
    }

    @PostMapping("/save")
    public ResponseEntity<CustomerDTO> saveCustomer(@RequestBody CustomerDTO customerDTO) throws BadRequestException {
        try {
            CustomerDTO customer = customerService.saveCustomer(customerDTO);
            return new ResponseEntity<>(customer, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{id}/address")
    public ResponseEntity<AddressDTO> addAddressToCustomer(@PathVariable int id, @RequestBody AddressDTO addressDTO) throws BadRequestException {
        AddressDTO newAddress = customerService.addAddressToCustomer(id, addressDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newAddress);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable Integer id, @RequestBody CustomerDTO customerDTO) throws BadRequestException {
        try {
            CustomerDTO updatedCustomer = customerService.updateCustomer(id, customerDTO);
            return new ResponseEntity<>(updatedCustomer, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<Void> updateStaffStatus(@PathVariable Integer id, @RequestBody Map<String, String> updates) {
        String newStatus = updates.get("status");
        customerService.updateStatus(id, newStatus);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{addressId}/default")
    public ResponseEntity<Address> updateDefaultAddress(
            @PathVariable Integer addressId,
            @RequestParam("customerId") Integer customerId,
            @RequestParam("isDefault") Boolean defaultAddress) {
        // Gọi service để cập nhật địa chỉ mặc định
        Address updatedAddress = customerService.updateAddressDefault(customerId, addressId, defaultAddress);
        return ResponseEntity.ok(updatedAddress);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomerById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
