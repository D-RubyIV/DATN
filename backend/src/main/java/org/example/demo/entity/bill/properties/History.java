package org.example.demo.entity.bill.properties;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.bill.core.Bill;
import org.example.demo.entity.bill.enums.Status;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "history")
public class History extends BaseEntity {

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "note")
    private String note;

    @ManyToOne
    @JoinColumn(name = "bill_id")
    private Bill bills;
}
