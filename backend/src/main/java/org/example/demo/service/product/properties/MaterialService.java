package org.example.demo.service.product.properties;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.MaterialRequestDTO;
import org.example.demo.entity.product.properties.Material; // Đổi từ Image sang Material
import org.example.demo.mapper.product.request.properties.MaterialRequestMapper; // Đổi từ ImageRequestMapper sang MaterialRequestMapper
import org.example.demo.repository.product.properties.MaterialRepository; // Đổi từ ImageRepository sang MaterialRepository
import org.example.demo.service.IService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialService implements IService<Material, Integer, MaterialRequestDTO> { // Đổi từ ImageService sang MaterialService

    @Autowired
    private MaterialRepository materialRepository; // Đổi từ imageRepository sang materialRepository

    @Autowired
    private MaterialRequestMapper materialRequestMapper; // Đổi từ imageRequestMapper sang materialRequestMapper

    public Page<Material> findAll(Pageable pageable) { // Đổi từ Image sang Material
        return materialRepository.findAll(pageable);
    }
    public List<Material> findAllList() {
        return materialRepository.findAll();
    }
    @Override
    public Material findById(Integer id) throws BadRequestException { // Đổi từ Image sang Material
        return materialRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Material not found with id: " + id)); // Đổi từ Image sang Material
    }

    @Override
    public Material delete(Integer id) throws BadRequestException { // Đổi từ Image sang Material
        Material entityFound = findById(id); // Đổi từ Image sang Material
        entityFound.setDeleted(true);
        return materialRepository.save(entityFound); // Đổi từ imageRepository sang materialRepository
    }

    @Override
    public Material save(MaterialRequestDTO requestDTO) throws BadRequestException { // Đổi từ Image sang Material
        boolean exists = materialRepository.existsByCodeAndName(requestDTO.getCode(), requestDTO.getName()); // Đổi từ imageRepository sang materialRepository
        if (exists) {
            throw new BadRequestException("Material with code " + requestDTO.getCode() + " and name " + requestDTO.getName() + " already exists."); // Đổi từ Image sang Material
        }

        Material entityMapped = materialRequestMapper.toEntity(requestDTO); // Đổi từ Image sang Material
        entityMapped.setDeleted(false);
        return materialRepository.save(entityMapped); // Đổi từ imageRepository sang materialRepository
    }

    @Override
    public Material update(Integer id, MaterialRequestDTO requestDTO) throws BadRequestException { // Đổi từ Image sang Material
        Material entityFound = findById(id); // Đổi từ Image sang Material
        entityFound.setCode(requestDTO.getCode());
        entityFound.setName(requestDTO.getName());

        return materialRepository.save(entityFound); // Đổi từ imageRepository sang materialRepository
    }

    @Transactional
    public List<Material> saveAll(List<MaterialRequestDTO> requestDTOList) { // Đổi từ Image sang Material
        List<Material> entityMapped = materialRequestMapper.toListEntity(requestDTOList); // Đổi từ Image sang Material
        return materialRepository.saveAll(entityMapped); // Đổi từ imageRepository sang materialRepository
    }

}