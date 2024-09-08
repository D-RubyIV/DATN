package org.example.service;

import org.example.demo.entity.human.customer.Customer;

import java.util.Optional;

public interface CustomerService {

    Optional<Customer> getCustomerById(Integer id);
}
