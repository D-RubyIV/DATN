package org.example.demo.mapper.event;

import org.example.demo.dto.event.EventDTO;
import org.example.demo.dto.event.EventListDTO;
import org.example.demo.entity.event.Event;
import org.example.demo.entity.product.properties.Product;
import org.example.demo.repository.product.properties.ProductRepository;

import java.util.List;

public class EventMapper {

    // convert Event --> EventListDTO
    public static EventListDTO toEventListDTO(Event event) {
        event.updateStatusBasedOnTime(); // cap nhat status dua tren time
        return new EventListDTO(
                event.getId(),
                event.getDiscountCode(),
                event.getName(),
                event.getDiscountPercent(),
                event.getStartDate(),
                event.getEndDate(),
                event.getQuantityDiscount(),
                event.getStatus() // tra ve trang thai da dc cap nhat
        );
    }

    // convert EventDTO --> Event
    public static Event toEventEntity(EventDTO dto, ProductRepository productRepository) {
        Event event = new Event();
        event.updateStatusBasedOnTime();
        event.setId(dto.getId());
        event.setDiscountCode(dto.getDiscountCode());
        event.setName(dto.getName());
        event.setDiscountPercent(dto.getDiscountPercent());
        event.setStartDate(dto.getStartDate());
        event.setEndDate(dto.getEndDate());
        event.setQuantityDiscount(dto.getQuantityDiscount());

        // Lấy danh sách sản phẩm từ `productCodes` và thêm vào sự kiện
        if (dto.getProductCodes() != null) {
            List<Product> products = productRepository.findByCodeIn(dto.getProductCodes());
            event.setProducts(products);
        }

        return event;
    }

    // Convert Event --> EventDTO
//    public static EventDTO toEventDTO(Event event) {
//
//    }
}
