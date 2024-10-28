package org.example.demo.controller.customer;

import org.example.demo.dto.customer.AddressDTO;
import org.example.demo.entity.human.customer.Address;
import org.example.demo.service.customer.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//@CrossOrigin("*")
@RestController
@RequestMapping("/address")
public class AddressController {

    @Autowired
    AddressService addressService;

    @GetMapping("/{id}")
    public ResponseEntity<AddressDTO> getAddress(@PathVariable Integer id) {
        AddressDTO addressDTO = addressService.getAddressById(id);
        return ResponseEntity.ok(addressDTO);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<AddressDTO> update(@PathVariable Integer id, @RequestBody AddressDTO addressDTO) {
        try {

            AddressDTO updatedAddress = addressService.updateAddress(id, addressDTO);
            return ResponseEntity.ok(updatedAddress);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok().build();
    }
}
