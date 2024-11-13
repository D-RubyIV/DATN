package org.example.demo.repository.event;

import org.example.demo.entity.event.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

    // find All Event By CreateDate
    @Query("select e from Event e order by e.createdDate DESC")
    Page<Event> findAllEvents(Pageable pageable);

    // search by Code, name
    @Query("select e from Event e where lower(e.discountCode) like lower(concat('%', :search, '%')) or lower(e.name) like lower(concat('%', : search, '%'))")
    Page<Event> findEventsBySearch(String search, Pageable pageable);

    // filter status
    @Query("select e from Event e where e.status = :status")
    Page<Event> findEventsByStatus(String status, Pageable pageable);

    // filter startDate and endDate
    @Query("SELECT e FROM Event e WHERE e.startDate <= ?2 AND e.endDate >= ?1")
    Page<Event> findByDateRangeOverlap(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

}
