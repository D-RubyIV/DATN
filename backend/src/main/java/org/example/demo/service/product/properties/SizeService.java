package org.example.demo.service.product.properties;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.SizeRequestDTO;
import org.example.demo.entity.product.properties.Size; // Đổi từ Origin sang Size
import org.example.demo.mapper.product.request.properties.SizeRequestMapper; // Đổi từ OriginRequestMapper sang SizeRequestMapper
import org.example.demo.repository.product.properties.SizeRepository; // Đổi từ OriginRepository sang SizeRepository
import org.example.demo.service.IService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SizeService implements IService<Size, Integer, SizeRequestDTO> { // Đổi từ OriginService sang SizeService

    @Autowired
    private SizeRepository sizeRepository; // Đổi từ originRepository sang sizeRepository

    @Autowired
    private SizeRequestMapper sizeRequestMapper; // Đổi từ originRequestMapper sang sizeRequestMapper

    public Page<Size> findAll(Pageable pageable) { // Đổi từ Origin sang Size
        return sizeRepository.findAll(pageable);
    }
    public List<Size> findAllList() {
        return sizeRepository.findAll();
    }
    @Override
    public Size findById(Integer id) throws BadRequestException { // Đổi từ Origin sang Size
        return sizeRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Size not found with id: " + id)); // Đổi từ Origin sang Size
    }

    @Override
    public Size delete(Integer id) throws BadRequestException { // Đổi từ Origin sang Size
        Size entityFound = findById(id); // Đổi từ Origin sang Size
        entityFound.setDeleted(true);
        return sizeRepository.save(entityFound); // Đổi từ originRepository sang sizeRepository
    }

    @Override
    public Size save(SizeRequestDTO requestDTO) throws BadRequestException { // Đổi từ Origin sang Size
        boolean exists = sizeRepository.existsByCodeAndName(requestDTO.getCode(), requestDTO.getName()); // Đổi từ originRepository sang sizeRepository
        if (exists) {
            throw new BadRequestException("Size with code " + requestDTO.getCode() + " and name " + requestDTO.getName() + " already exists."); // Đổi từ Origin sang Size
        }

        Size entityMapped = sizeRequestMapper.toEntity(requestDTO); // Đổi từ Origin sang Size
        entityMapped.setDeleted(false);
        return sizeRepository.save(entityMapped); // Đổi từ originRepository sang sizeRepository
    }

    @Override
    public Size update(Integer id, SizeRequestDTO requestDTO) throws BadRequestException { // Đổi từ Origin sang Size
        Size entityFound = findById(id); // Đổi từ Origin sang Size
        entityFound.setCode(requestDTO.getCode());
        entityFound.setName(requestDTO.getName());

        return sizeRepository.save(entityFound); // Đổi từ originRepository sang sizeRepository
    }

    @Transactional
    public List<Size> saveAll(List<SizeRequestDTO> requestDTOList) { // Đổi từ Origin sang Size
        List<Size> entityMapped = sizeRequestMapper.toListEntity(requestDTOList); // Đổi từ Origin sang Size
        return sizeRepository.saveAll(entityMapped); // Đổi từ originRepository sang sizeRepository
    }

}