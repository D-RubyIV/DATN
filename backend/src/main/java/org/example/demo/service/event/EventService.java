package org.example.demo.service.event;

import org.example.demo.dto.event.EventDTO;
import org.example.demo.dto.event.EventListDTO;
import org.example.demo.repository.product.properties.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EventService {

    Page<EventListDTO> getEvents(Pageable pageable);

    EventDTO saveEvent(EventDTO eventDTO, ProductRepository productRepository);
}
