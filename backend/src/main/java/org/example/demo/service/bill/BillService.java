package org.example.demo.service.bill;

import org.apache.coyote.BadRequestException;
import org.example.demo.dto.requests.BillRequestDTO;
import org.example.demo.entity.bill.core.Bill;
import org.example.demo.mapper.bill.request.BillRequestMapper;
import org.example.demo.mapper.bill.response.BillResponseMapper;
import org.example.demo.repository.bill.BillRepository;
import org.example.demo.service.IService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BillService implements IService<Bill, Integer, BillRequestDTO> {
    @Autowired
    private BillRepository billRepository;

    @Autowired
    private BillResponseMapper billResponseMapper;

    @Autowired
    private BillRequestMapper billRequestMapper;

    public Page<Bill> findAll(Pageable pageable){
        return billRepository.findAll(pageable);
    }

    @Override
    public Bill findById(Integer id) throws BadRequestException {
        return billRepository.findById(id).orElseThrow(()-> new BadRequestException("Bill not found"));
    }

    @Override
    @Transactional
    public Bill delete(Integer id, int status) throws BadRequestException {
        Bill entityFound = findById(id);
        entityFound.setDeleted(true);
        return entityFound;
    }

    @Override
    public Bill save(BillRequestDTO requestDTO) {
        Bill entityMapped = billRequestMapper.toEntity(requestDTO);
        return billRepository.save(entityMapped);
    }

    @Override
    public Bill update(Integer integer, BillRequestDTO requestDTO) {
        return null;
    }
}
