package org.example.demo.service.product.properties;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.ThicknessRequestDTO;
import org.example.demo.entity.product.properties.Thickness; // Đổi từ Texture sang Thickness
import org.example.demo.mapper.product.request.properties.ThicknessRequestMapper; // Đổi từ TextureRequestMapper sang ThicknessRequestMapper
import org.example.demo.repository.product.properties.ThicknessRepository; // Đổi từ TextureRepository sang ThicknessRepository
import org.example.demo.service.IService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThicknessService implements IService<Thickness, Integer, ThicknessRequestDTO> { // Đổi từ TextureService sang ThicknessService

    @Autowired
    private ThicknessRepository thicknessRepository; // Đổi từ textureRepository sang thicknessRepository

    @Autowired
    private ThicknessRequestMapper thicknessRequestMapper; // Đổi từ textureRequestMapper sang thicknessRequestMapper

    public Page<Thickness> findAll(Pageable pageable) { // Đổi từ Texture sang Thickness
        return thicknessRepository.findAll(pageable);
    }
    public List<Thickness> findAllList() {
        return thicknessRepository.findAll();
    }
    @Override
    public Thickness findById(Integer id) throws BadRequestException { // Đổi từ Texture sang Thickness
        return thicknessRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Thickness not found with id: " + id)); // Đổi từ Texture sang Thickness
    }

    @Override
    public Thickness delete(Integer id) throws BadRequestException { // Đổi từ Texture sang Thickness
        Thickness entityFound = findById(id); // Đổi từ Texture sang Thickness
        entityFound.setDeleted(true);
        return thicknessRepository.save(entityFound); // Đổi từ textureRepository sang thicknessRepository
    }

    @Override
    public Thickness save(ThicknessRequestDTO requestDTO) throws BadRequestException { // Đổi từ Texture sang Thickness
        boolean exists = thicknessRepository.existsByCodeAndName(requestDTO.getCode(), requestDTO.getName()); // Đổi từ textureRepository sang thicknessRepository
        if (exists) {
            throw new BadRequestException("Thickness with code " + requestDTO.getCode() + " and name " + requestDTO.getName() + " already exists."); // Đổi từ Texture sang Thickness
        }

        Thickness entityMapped = thicknessRequestMapper.toEntity(requestDTO); // Đổi từ Texture sang Thickness
        entityMapped.setDeleted(false);
        return thicknessRepository.save(entityMapped); // Đổi từ textureRepository sang thicknessRepository
    }

    @Override
    public Thickness update(Integer id, ThicknessRequestDTO requestDTO) throws BadRequestException { // Đổi từ Texture sang Thickness
        Thickness entityFound = findById(id); // Đổi từ Texture sang Thickness
        entityFound.setCode(requestDTO.getCode());
        entityFound.setName(requestDTO.getName());

        return thicknessRepository.save(entityFound); // Đổi từ textureRepository sang thicknessRepository
    }

    @Transactional
    public List<Thickness> saveAll(List<ThicknessRequestDTO> requestDTOList) { // Đổi từ Texture sang Thickness
        List<Thickness> entityMapped = thicknessRequestMapper.toListEntity(requestDTOList); // Đổi từ Texture sang Thickness
        return thicknessRepository.saveAll(entityMapped); // Đổi từ textureRepository sang thicknessRepository
    }

}