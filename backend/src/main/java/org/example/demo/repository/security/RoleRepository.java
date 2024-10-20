package org.example.demo.repository.security;

import org.example.demo.entity.human.role.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Integer> {
}
