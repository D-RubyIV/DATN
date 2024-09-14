package org.example.demo.entity.order.properties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.order.core.Order;
import org.example.demo.entity.order.enums.Status;

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
    @JoinColumn(name = "order_id")
    private Order order;
}
