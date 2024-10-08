package org.example.demo.service.product.properties;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.ColorRequestDTO;
import org.example.demo.entity.product.properties.Color; // Đổi từ Collar sang Color
import org.example.demo.mapper.product.request.properties.ColorRequestMapper; // Đổi từ CollarRequestMapper sang ColorRequestMapper
import org.example.demo.repository.product.properties.ColorRepository; // Đổi từ CollarRepository sang ColorRepository
import org.example.demo.service.IService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ColorService implements IService<Color, Integer, ColorRequestDTO> { // Đổi từ CollarService sang ColorService

    @Autowired
    private ColorRepository colorRepository; // Đổi từ collarRepository sang colorRepository

    @Autowired
    private ColorRequestMapper colorRequestMapper; // Đổi từ collarRequestMapper sang colorRequestMapper

    public Page<Color> findAll(Pageable pageable) { // Đổi từ Collar sang Color
        return colorRepository.findAll(pageable);
    }
    public List<Color> findAllList() {
        return colorRepository.findAll();
    }

    @Override
    public Color findById(Integer id) throws BadRequestException { // Đổi từ Collar sang Color
        return colorRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Color not found with id: " + id)); // Đổi từ Collar sang Color
    }

    @Override
    public Color delete(Integer id) throws BadRequestException { // Đổi từ Collar sang Color
        Color entityFound = findById(id); // Đổi từ Collar sang Color
        entityFound.setDeleted(true);
        return colorRepository.save(entityFound); // Đổi từ collarRepository sang colorRepository
    }

    @Override
    public Color save(ColorRequestDTO requestDTO) throws BadRequestException { // Đổi từ Collar sang Color
        boolean exists = colorRepository.existsByCodeAndName(requestDTO.getCode(), requestDTO.getName()); // Đổi từ collarRepository sang colorRepository
        if (exists) {
            throw new BadRequestException("Color with code " + requestDTO.getCode() + " and name " + requestDTO.getName() + " already exists."); // Đổi từ Collar sang Color
        }

        Color entityMapped = colorRequestMapper.toEntity(requestDTO); // Đổi từ Collar sang Color
        entityMapped.setDeleted(false);
        return colorRepository.save(entityMapped); // Đổi từ collarRepository sang colorRepository
    }

    @Override
    public Color update(Integer id, ColorRequestDTO requestDTO) throws BadRequestException { // Đổi từ Collar sang Color
        Color entityFound = findById(id); // Đổi từ Collar sang Color
        entityFound.setCode(requestDTO.getCode());
        entityFound.setName(requestDTO.getName());

        return colorRepository.save(entityFound); // Đổi từ collarRepository sang colorRepository
    }

    @Transactional
    public List<Color> saveAll(List<ColorRequestDTO> requestDTOList) { // Đổi từ Collar sang Color
        List<Color> entityMapped = colorRequestMapper.toListEntity(requestDTOList); // Đổi từ Collar sang Color
        return colorRepository.saveAll(entityMapped); // Đổi từ collarRepository sang colorRepository
    }

}