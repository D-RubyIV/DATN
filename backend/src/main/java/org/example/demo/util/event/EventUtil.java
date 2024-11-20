package org.example.demo.util.event;

import org.example.demo.entity.event.Event;

import java.util.List;

public class EventUtil {
    public static double getAveragePercentEvent(List<Event> validEvents) {
        return validEvents.stream()
                .mapToInt(Event::getDiscountPercent)
                .average()
                .orElse(0.0); // Giá trị mặc định là 0.0 nếu danh sách rỗng
    }
}

