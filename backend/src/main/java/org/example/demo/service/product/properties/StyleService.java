package org.example.demo.service.product.properties;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.StyleRequestDTO;
import org.example.demo.entity.product.properties.Style; // Đổi từ Sleeve sang Style
import org.example.demo.mapper.product.request.properties.StyleRequestMapper; // Đổi từ SleeveRequestMapper sang StyleRequestMapper
import org.example.demo.repository.product.properties.StyleRepository; // Đổi từ SleeveRepository sang StyleRepository
import org.example.demo.service.IService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StyleService implements IService<Style, Integer, StyleRequestDTO> { // Đổi từ SleeveService sang StyleService

    @Autowired
    private StyleRepository styleRepository; // Đổi từ sleeveRepository sang styleRepository

    @Autowired
    private StyleRequestMapper styleRequestMapper; // Đổi từ sleeveRequestMapper sang styleRequestMapper

    public Page<Style> findAll(Pageable pageable) { // Đổi từ Sleeve sang Style
        return styleRepository.findAll(pageable);
    }
    public List<Style> findAllList() {
        return styleRepository.findAll();
    }
    @Override
    public Style findById(Integer id) throws BadRequestException { // Đổi từ Sleeve sang Style
        return styleRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Style not found with id: " + id)); // Đổi từ Sleeve sang Style
    }

    @Override
    public Style delete(Integer id) throws BadRequestException { // Đổi từ Sleeve sang Style
        Style entityFound = findById(id); // Đổi từ Sleeve sang Style
        entityFound.setDeleted(true);
        return styleRepository.save(entityFound); // Đổi từ sleeveRepository sang styleRepository
    }

    @Override
    public Style save(StyleRequestDTO requestDTO) throws BadRequestException { // Đổi từ Sleeve sang Style
        boolean exists = styleRepository.existsByCodeAndName(requestDTO.getCode(), requestDTO.getName()); // Đổi từ sleeveRepository sang styleRepository
        if (exists) {
            throw new BadRequestException("Style with code " + requestDTO.getCode() + " and name " + requestDTO.getName() + " already exists."); // Đổi từ Sleeve sang Style
        }

        Style entityMapped = styleRequestMapper.toEntity(requestDTO); // Đổi từ Sleeve sang Style
        entityMapped.setDeleted(false);
        return styleRepository.save(entityMapped); // Đổi từ sleeveRepository sang styleRepository
    }

    @Override
    public Style update(Integer id, StyleRequestDTO requestDTO) throws BadRequestException { // Đổi từ Sleeve sang Style
        Style entityFound = findById(id); // Đổi từ Sleeve sang Style
        entityFound.setCode(requestDTO.getCode());
        entityFound.setName(requestDTO.getName());

        return styleRepository.save(entityFound); // Đổi từ sleeveRepository sang styleRepository
    }

    @Transactional
    public List<Style> saveAll(List<StyleRequestDTO> requestDTOList) { // Đổi từ Sleeve sang Style
        List<Style> entityMapped = styleRequestMapper.toListEntity(requestDTOList); // Đổi từ Sleeve sang Style
        return styleRepository.saveAll(entityMapped); // Đổi từ sleeveRepository sang styleRepository
    }

}