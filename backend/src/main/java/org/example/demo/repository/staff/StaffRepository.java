package org.example.demo.repository.staff;

import org.example.demo.entity.human.staff.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff,Integer> {
    @Query("SELECT s FROM Staff s WHERE (:code IS NULL OR s.code = :code) AND " +
            "(:name IS NULL OR s.name LIKE %:name%) AND " +
            "(:fromDate IS NULL OR s.birthDay >= :fromDate) AND " +
            "(:toDate IS NULL OR s.birthDay <= :toDate)")
    List<Staff> findAllStaff(
            @Param("code") String code,
            @Param("name") String name,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );
    @Query("SELECT s FROM Staff s WHERE " +
            "(:code IS NULL OR s.code LIKE %:code%) AND " +
            "(:name IS NULL OR s.name LIKE %:name%) AND " +
            "(:phone IS NULL OR s.phone LIKE %:phone%) AND " +
            "(:email IS NULL OR s.email LIKE %:email%) AND " +
            "(:address IS NULL OR s.address LIKE %:address%) AND " +
            "(:ward IS NULL OR s.ward LIKE %:ward%) AND " +
            "(:district IS NULL OR s.district LIKE %:district%) AND " +
            "(:province IS NULL OR s.province LIKE %:province%) AND " +
            "(:fromDate IS NULL OR s.birthDay >= :fromDate) AND " +
            "(:toDate IS NULL OR s.birthDay <= :toDate)")
    Page<Staff> findAllByCriteria(
            @Param("code") String code,
            @Param("name") String name,
            @Param("phone") String phone,
            @Param("email") String email,
            @Param("address") String address,
            @Param("ward") String ward,
            @Param("district") String district,
            @Param("province") String province,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            Pageable pageable);
}
