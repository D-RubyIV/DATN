//package org.example.demo;
//
//import jakarta.annotation.PostConstruct;
//import jakarta.persistence.EntityManager;
//import org.example.demo.dto.staff.request.StaffRequestDTO;
//import org.example.demo.entity.human.role.Role;
//import org.example.demo.entity.human.staff.Staff;
//import org.example.demo.entity.security.Account;
//import org.example.demo.exception.DataNotFoundException;
//import org.example.demo.exception.PermissionDenyException;
//import org.example.demo.repository.security.RoleRepository;
//import org.example.demo.repository.staff.StaffRepository;
//import org.example.demo.service.auth.AccountService;
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
//    private AccountService userService;
//    @Autowired
//    private EntityManager entityManager;
//
//    @Transactional
//    @PostConstruct
//    public void init() throws DataNotFoundException, PermissionDenyException {
//        // ROLE
//        if(roleRepository.findByCode("ADMIN").isEmpty()){
//            Role role = new Role();
//            role.setCode("ADMIN");
//            role.setName("ADMIN");
//            roleRepository.save(role);
//        }
//        if(roleRepository.findByCode("USER").isEmpty()){
//            Role role = new Role();
//            role.setCode("USER");
//            role.setName("USER");
//            roleRepository.save(role);
//        }
//        // PAYMENT
//        if (staffRepository.findByEmail("admin1@gmail.com").isEmpty()){
//            StaffRequestDTO staff = new StaffRequestDTO();
//            staff.setEmail("admin1@gmail.com");
//            staff.setPassword("admin");
//            staff.setRoleId(roleRepository.findByCode("USER").get().getId());
//            Staff staf = userService.createStaff(staff);
//            staf.setRole(roleRepository.findByCode("ADMIN").get());
//            staffRepository.save(staf);
//        }
//        if (staffRepository.findByEmail("admin2@gmail.com").isEmpty()){
//            StaffRequestDTO staff = new StaffRequestDTO();
//            staff.setEmail("admin2@gmail.com");
//            staff.setPassword("admin");
//            staff.setRoleId(roleRepository.findByCode("USER").get().getId());
//            userService.createStaff(staff);
//        }
//    } // adf nahm tuonu cua t toiio tuong b sua r g b nham =)) usser mam cux day cua b
//}