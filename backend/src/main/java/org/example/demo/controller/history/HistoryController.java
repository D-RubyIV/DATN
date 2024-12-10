package org.example.demo.controller.history;

import org.example.demo.mapper.history.response.HistoryResponseMapper;
import org.example.demo.repository.history.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "history")
public class HistoryController {
    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private HistoryResponseMapper historyResponseMapper;

    @GetMapping(value = "{id}")
    public ResponseEntity<?> findAllByOrderId(@PathVariable Integer id) {
        return ResponseEntity.ok(historyRepository.findAllByOrderId(id));
    }

    @GetMapping("/timeline/{id}")
    public ResponseEntity<?> findAllByTimelineId(@PathVariable Integer id) {
        return ResponseEntity.ok(historyResponseMapper.toDTO(historyRepository.findById(id).orElse(null)));
    }


}
