package org.example.demo.service.event.impl;

import org.example.demo.dto.event.EventDTO;
import org.example.demo.dto.event.EventListDTO;
import org.example.demo.entity.event.Event;
import org.example.demo.entity.product.properties.Product;
import org.example.demo.mapper.event.EventMapper;
import org.example.demo.repository.event.EventRepository;
import org.example.demo.repository.product.properties.ProductRepository;
import org.example.demo.service.event.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Page<EventListDTO> filterStatus(String status, Pageable pageable) {
        if (status != null && !status.isEmpty()) {
            return eventRepository.findEventsByStatus(status, pageable)
                    .map(EventMapper::toEventListDTO);
        }
        return eventRepository.findAllEvents(pageable)
                .map(EventMapper::toEventListDTO);
    }

    @Override
    public Page<EventListDTO> search(String search, Pageable pageable) {
        return eventRepository.findEventsBySearch(search, pageable)
                .map(EventMapper::toEventListDTO);
    }

    @Override
    public Page<EventListDTO> getEvents(Pageable pageable) {
        return eventRepository.findAllEvents(pageable)
                .map(EventMapper::toEventListDTO);
    }

    @Override
    public EventDTO getById(Integer id) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("ID không ton tại"));
        return EventMapper.toEventDTO(event);
    }


    @Override
    @Transactional
    public EventDTO saveEvent(EventDTO eventDTO) {
        // Tạo mã giảm giá nếu không có
        if (eventDTO.getDiscountCode() == null || eventDTO.getDiscountCode().isEmpty()) {
            String generatedDiscountCode = generateDiscountCode(eventDTO);
            eventDTO.setDiscountCode(generatedDiscountCode);
        }

        // Tính toán quantityDiscount từ danh sách sản phẩm trong productDTOS
        if (eventDTO.getProductDTOS() != null && !eventDTO.getProductDTOS().isEmpty()) {
            eventDTO.setQuantityDiscount(eventDTO.getProductDTOS().size());
        }

        // Chuyển đổi EventDTO thành entity Event
        Event event = EventMapper.toEventEntity(eventDTO);

        // Xử lý các sản phẩm để đảm bảo chúng không bị detached
        if (event.getProducts() != null) {
            List<Product> managedProducts = new ArrayList<>();
            for (Product product : event.getProducts()) {
                if (product.getId() != null) {
                    // Tìm và gán thực thể đã quản lý
                    Optional<Product> managedProduct = productRepository.findById(product.getId());
                    managedProduct.ifPresent(managedProducts::add);
                } else {
                    // Thêm sản phẩm mới nếu không có ID
                    managedProducts.add(product);
                }
            }
            event.setProducts(managedProducts);
        }

        // Cập nhật trạng thái sự kiện dựa trên thời gian
        event.updateStatusBasedOnTime();

        // Lưu sự kiện vào repository
        Event savedEvent = eventRepository.save(event);

        // Chuyển đổi entity sự kiện đã lưu trở lại DTO và trả về
        return EventMapper.toEventDTO(savedEvent);
    }

    @Override
    @Transactional
    public EventDTO updateEvent(Integer id, EventDTO eventDTO) {
        Event exitstingEvent = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("ID không ton tại"));

        // Ánh xạ từ EventDTO sang Event
        Event eventUpdate = EventMapper.toEventEntity(eventDTO);
        eventUpdate.setId(exitstingEvent.getId());  // Thiết lập ID của event đã tồn tại

        Event updateEvent = eventRepository.save(eventUpdate);

        return EventMapper.toEventDTO(updateEvent);
    }

    @Override
    @Transactional
    public void deleteEvent(Integer id) {
        // Kiểm tra sự tồn tại của sự kiện
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        eventRepository.delete(event);
    }

    // Phương thức phụ để tạo mã giảm giá
    private String generateDiscountCode(EventDTO eventDTO) {
        // Ví dụ logic: Mã giảm giá dựa trên tên sự kiện và ngày bắt đầu
        String eventName = eventDTO.getName().toUpperCase().replaceAll("[^A-Z0-9]", ""); // Làm sạch tên
//        String datePart = eventDTO.getStartDate().toLocalDate().toString().replaceAll("-", ""); // Định dạng ngày dưới dạng YYYYMMDD
        return "MGG-" + eventName;
    }
}

