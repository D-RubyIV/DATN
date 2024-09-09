package org.example.demo.controller.voucher;

import org.example.demo.entity.human.customer.Customer;
import org.example.demo.repository.voucher.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping("/get-all")
    public List<Customer> getAll() {
        return customerRepository.findAll();
    }
}
