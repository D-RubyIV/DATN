package org.example.demo.service.event.impl;

import org.example.demo.dto.event.EventDTO;
import org.example.demo.dto.event.EventListDTO;
import org.example.demo.entity.event.Event;
import org.example.demo.mapper.event.EventMapper;
import org.example.demo.repository.event.EventRepository;
import org.example.demo.repository.product.properties.ProductRepository;
import org.example.demo.service.event.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;


    @Override
    public Page<EventListDTO> getEvents(Pageable pageable) {
        return eventRepository.findAllEvents(pageable)
                .map(EventMapper::toEventListDTO);
    }


    @Override
    public EventDTO saveEvent(EventDTO eventDTO, ProductRepository productRepository) {
        Event event = EventMapper.toEventEntity(eventDTO, productRepository);
        Event saveEvent =  eventRepository.save(event);
        return null;
    }
}
