package org.example.demo.repository.voucher;

import org.example.demo.entity.voucher.Voucher;
import org.example.demo.model.request.VoucherRequest;
import org.example.demo.model.response.VoucherResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Integer> {


    @Query(value = """
    SELECT 
        ROW_NUMBER() OVER(ORDER BY v.id DESC) AS indexs,
        v.id AS id,
        v.code AS code,
        v.name AS name, 
        v.type_ticket AS typeTicket,
        v.quantity AS quantity,
        v.start_date AS startDate,
        v.end_date AS endDate,
        v.max_percent AS maxPercent,
        v.min_amount AS minAmount,
        v.status AS status,
        c.id AS customerId,
        c.name AS customerName,
        c.email AS customerEmail
    FROM voucher v
    LEFT JOIN voucher_customer vc ON v.id = vc.voucher_id
    LEFT JOIN customer c ON vc.customer_id = c.id
    ORDER BY v.id DESC
    """, nativeQuery = true)
    List<VoucherResponse> getPublicVoucher();

    @Query(value = """
    SELECT 
        ROW_NUMBER() OVER(ORDER BY v.id DESC) AS indexs,
        v.id AS id,
        v.code AS code,
        v.name AS name, 
        v.type_ticket AS typeTicket,
        v.quantity AS quantity,
        v.start_date AS startDate,
        v.end_date AS endDate,
        v.max_percent AS maxPercent,
        v.min_amount AS minAmount,
        v.status AS status,
        c.id AS customerId,
        c.name AS customerName,
        c.email AS customerEmail
    FROM voucher v
    LEFT JOIN voucher_customer vc ON v.id = vc.voucher_id
    LEFT JOIN customer c ON vc.customer_id = c.id
    WHERE (:idCustomer IS NULL OR c.id = :idCustomer)
    AND (:#{#req.name} IS NULL OR :#{#req.name} = '' OR v.name LIKE %:#{#req.name}% OR v.code LIKE %:#{#req.name}%)
    AND (:#{#req.status} IS NULL OR v.status = :#{#req.status})
    ORDER BY v.id DESC
""", nativeQuery = true)
    List<VoucherResponse> getAllVouchersWithCustomers(@Param("idCustomer") Integer id, @Param("req") VoucherRequest request);

    @Query(value = """
    SELECT 
        v.id as id,
        v.code as code,
        v.name as name, 
        v.type_ticket as typeTicket,
        v.quantity as quantity,
        v.start_date as startDate,
        v.end_date as endDate,
        v.max_percent as maxPercent,
        v.min_amount as minAmount,
        v.status as status,
        c.id as customerId,
        c.name as customerName,
        c.email as customerEmail
    FROM voucher v
    LEFT JOIN voucher_customer vc ON v.id = vc.voucher_id
    LEFT JOIN customer c ON vc.customer_id = c.id
    WHERE v.id = :id
""", nativeQuery = true)
    Optional<VoucherResponse> findVoucherById(Integer id);

}
