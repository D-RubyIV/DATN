package org.example.demo.repository.event;

import org.example.demo.entity.event.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

    @Query("select e from Event e order by e.createdDate DESC")
    Page<Event> findAllEvents(Pageable pageable);
}
