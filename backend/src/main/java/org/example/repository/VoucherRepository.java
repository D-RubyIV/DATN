package org.example.repository;

import org.example.demo.entity.voucher.Voucher;
import org.example.model.response.VoucherResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Integer> {

    @Query(value = """
        Select 
        v.id,
        v.code,
        v.name, 
        v.typeTicket as 'typeVoucher',
        v.quantity,
        v.startDate,
        v.endDate,
        v.maxDiscount,
        v.minTotal,
        v.status
    from voucher as v where v.deleted = 0 
    """, nativeQuery = true)
    List<VoucherResponse> getAllVoucher();

    @Query(value = """
    SELECT 
        v.id as id,
        v.code as code,
        v.name as name, 
        v.typeTicket as typeVoucher,
        v.quantity as quantity,
        v.startDate as startDate,
        v.endDate as endDate,
        v.maxDiscount as maxDiscount,
        v.minTotal as minTotal,
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


//    @Query(value = """
//    Delete from voucher where id = :id
//""", nativeQuery = true)
//    @Modifying
//    @Transactional
//    void deleteVoucherByNativeQuery(Integer id);

}
