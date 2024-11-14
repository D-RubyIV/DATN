package org.example.demo.controller.event;

import org.example.demo.dto.event.EventDTO;
import org.example.demo.dto.event.EventListDTO;
import org.example.demo.dto.product.mchien.ProductDTO;
import org.example.demo.service.event.EventService;
import org.example.demo.service.product.properties.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Date;

@RestController
@RequestMapping("/event")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private ProductService productService;

    @GetMapping("/filter-date")
    public ResponseEntity<Page<EventListDTO>> filterDate(
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<EventListDTO> listDTOPage = eventService.filterDate(startDate, endDate, pageable);
        return ResponseEntity.ok(listDTOPage);
    }

    @GetMapping("/product-list")
    public ResponseEntity<Page<ProductDTO>> getAllProductDTO(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<ProductDTO> productDTOS = productService.getAllProductDTO(pageable);
        return ResponseEntity.ok(productDTOS);
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<EventListDTO>> filterEvents(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<EventListDTO> eventListDTOS = eventService.filterStatus(status, pageable);
        return ResponseEntity.ok(eventListDTOS);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<EventListDTO>> searchEvents(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<EventListDTO> eventListDTOS = eventService.search(query, pageable);
        return ResponseEntity.ok(eventListDTOS);
    }

    @GetMapping("/all")
    public ResponseEntity<Page<EventListDTO>> getAllEvents(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<EventListDTO> events = eventService.getEvents(pageable);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<EventDTO> getEvent(@PathVariable Integer id) {
        return ResponseEntity.ok(eventService.getById(id));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Integer id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/save")
    public ResponseEntity<EventDTO> saveEvent(@RequestBody EventDTO eventDTO) {
        EventDTO saved = eventService.saveEvent(eventDTO);
        if (saved == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable Integer id, @RequestBody EventDTO eventDTO) {
        return ResponseEntity.ok(eventService.updateEvent(id, eventDTO));
    }
}
