//package org.example.demo;
//
//import jakarta.annotation.PostConstruct;
//import org.example.demo.dto.staff.request.StaffRequestDTO;
//import org.example.demo.entity.human.role.Role;
//import org.example.demo.exception.DataNotFoundException;
//import org.example.demo.exception.PermissionDenyException;
//import org.example.demo.repository.security.RoleRepository;
//import org.example.demo.repository.staff.StaffRepository;
//import org.example.demo.service.login.IUserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Transactional;
//
//
//@Transactional
//@Component
//public class InitDataBase {
//    @Autowired
//    private StaffRepository staffRepository;
//    @Autowired
//    private RoleRepository roleRepository;
//    @Autowired
//    private IUserService userService;
//
//    @Transactional
//    @PostConstruct
//    public void init() throws DataNotFoundException, PermissionDenyException {
//        // ROLE
//        if(roleRepository.findByCode("ROLE_ADMIN").isEmpty()){
//            Role role = new Role();
//            role.setCode("ROLE_ADMIN");
//            role.setName("ROLE_ADMIN");
//            roleRepository.save(role);
//        }
//        if(roleRepository.findByCode("ROLE_USER").isEmpty()){
//            Role role = new Role();
//            role.setCode("ROLE_USER");
//            role.setName("ROLE_USER");
//            roleRepository.save(role);
//        }
//        // PAYMENT
//        if (staffRepository.findByEmail("phah04@gmail.com").isEmpty()){
//            StaffRequestDTO staff = new StaffRequestDTO();
//            staff.setEmail("phah04@gmail.com");
//            staff.setPassword("12345");
//            staff.setRoleId(roleRepository.findByCode("ROLE_ADMIN").get().getId());
//            userService.createStaff(staff);
//        }
//    }
//}