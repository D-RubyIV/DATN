package org.example.demo.service.product.properties;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.OriginRequestDTO;
import org.example.demo.entity.product.properties.Origin; // Đổi từ Material sang Origin
import org.example.demo.mapper.product.request.properties.OriginRequestMapper; // Đổi từ MaterialRequestMapper sang OriginRequestMapper
import org.example.demo.repository.product.properties.OriginRepository; // Đổi từ MaterialRepository sang OriginRepository
import org.example.demo.service.IService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OriginService implements IService<Origin, Integer, OriginRequestDTO> { // Đổi từ MaterialService sang OriginService

    @Autowired
    private OriginRepository originRepository; // Đổi từ materialRepository sang originRepository

    @Autowired
    private OriginRequestMapper originRequestMapper; // Đổi từ materialRequestMapper sang originRequestMapper

    public Page<Origin> findAll(Pageable pageable) { // Đổi từ Material sang Origin
        return originRepository.findAll(pageable);
    }
    public List<Origin> findAllList() {
        return originRepository.findAll();
    }
    @Override
    public Origin findById(Integer id) throws BadRequestException { // Đổi từ Material sang Origin
        return originRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Origin not found with id: " + id)); // Đổi từ Material sang Origin
    }

    @Override
    public Origin delete(Integer id ) throws BadRequestException { // Đổi từ Material sang Origin
        Origin entityFound = findById(id); // Đổi từ Material sang Origin
        entityFound.setDeleted(true);
        return originRepository.save(entityFound); // Đổi từ materialRepository sang originRepository
    }

    @Override
    public Origin save(OriginRequestDTO requestDTO) throws BadRequestException { // Đổi từ Material sang Origin
        boolean exists = originRepository.existsByCodeAndName(requestDTO.getCode(), requestDTO.getName()); // Đổi từ materialRepository sang originRepository
        if (exists) {
            throw new BadRequestException("Origin with code " + requestDTO.getCode() + " and name " + requestDTO.getName() + " already exists."); // Đổi từ Material sang Origin
        }

        Origin entityMapped = originRequestMapper.toEntity(requestDTO); // Đổi từ Material sang Origin
        entityMapped.setDeleted(false);
        return originRepository.save(entityMapped); // Đổi từ materialRepository sang originRepository
    }

    @Override
    public Origin update(Integer id, OriginRequestDTO requestDTO) throws BadRequestException { // Đổi từ Material sang Origin
        Origin entityFound = findById(id); // Đổi từ Material sang Origin
        entityFound.setCode(requestDTO.getCode());
        entityFound.setName(requestDTO.getName());

        return originRepository.save(entityFound); // Đổi từ materialRepository sang originRepository
    }

    @Transactional
    public List<Origin> saveAll(List<OriginRequestDTO> requestDTOList) { // Đổi từ Material sang Origin
        List<Origin> entityMapped = originRequestMapper.toListEntity(requestDTOList); // Đổi từ Material sang Origin
        return originRepository.saveAll(entityMapped); // Đổi từ materialRepository sang originRepository
    }

}