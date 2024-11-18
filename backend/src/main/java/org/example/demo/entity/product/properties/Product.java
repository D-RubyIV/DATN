package org.example.demo.entity.product.properties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.example.demo.entity.BaseEntity;
import org.example.demo.entity.event.Event;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "product", uniqueConstraints = @UniqueConstraint(columnNames = "code"))
public class Product extends BaseEntity {

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "deleted")
    private Boolean deleted;

    @ManyToMany(mappedBy = "products")
    private List<Event> events = new ArrayList<>();

    public List<Event> getEvents() {
        return events.stream()
                .sorted((e1, e2) -> Integer.compare(e2.getDiscountPercent(), e1.getDiscountPercent()))
                .collect(Collectors.toList());
    }
}
