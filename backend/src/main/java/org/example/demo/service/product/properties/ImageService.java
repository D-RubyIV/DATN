package org.example.demo.service.product.properties;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.properties.ImageRequestDTO;
import org.example.demo.dto.product.response.properties.ElasticityResponseDTO;
import org.example.demo.dto.product.response.properties.ImageResponseDTO;
import org.example.demo.entity.product.properties.Image; // Đổi từ Elasticity sang Image
import org.example.demo.mapper.product.request.properties.ImageRequestMapper; // Đổi từ ElasticityRequestMapper sang ImageRequestMapper
import org.example.demo.mapper.product.response.properties.ImageResponseMapper;
import org.example.demo.repository.product.properties.ImageRepository; // Đổi từ ElasticityRepository sang ImageRepository
import org.example.demo.service.IService;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ImageService implements IService<Image, Integer, ImageRequestDTO> { // Đổi từ ElasticityService sang ImageService

    @Autowired
    private ImageRepository imageRepository; // Đổi từ elasticityRepository sang imageRepository

    @Autowired
    private ImageRequestMapper imageRequestMapper; // Đổi từ elasticityRequestMapper sang imageRequestMapper

    @Autowired
    private ImageResponseMapper imageResponseMapper;

    public Page<ImageResponseDTO> findAllOverviewByPage(
            LocalDateTime createdFrom,
            LocalDateTime createdTo,
            PageableObject pageableObject
    ) {
        Pageable pageable = pageableObject.toPageRequest();
        String query = pageableObject.getQuery();

        return imageRepository.findAllByPageWithQuery(query, createdFrom, createdTo, pageable).map(s -> imageResponseMapper.toOverViewDTO(s));
    }

    public Page<Image> findAll(Pageable pageable) { // Đổi từ Elasticity sang Image
        return imageRepository.findAll(pageable);
    }
    public List<Image> findAllList() {
        return imageRepository.findAll();
    }
    @Override
    public Image findById(Integer id) throws BadRequestException { // Đổi từ Elasticity sang Image
        return imageRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Image not found with id: " + id)); // Đổi từ Elasticity sang Image
    }

    @Override
    public Image delete(Integer id) throws BadRequestException { // Đổi từ Elasticity sang Image
        Image entityFound = findById(id); // Đổi từ Elasticity sang Image
        entityFound.setDeleted(true);
        return imageRepository.save(entityFound); // Đổi từ elasticityRepository sang imageRepository
    }

    @Override
    public Image save(ImageRequestDTO requestDTO) throws BadRequestException { // Đổi từ Elasticity sang Image
        boolean exists = imageRepository.existsByCodeAndUrl(requestDTO.getCode(), requestDTO.getUrl()); // Đổi từ elasticityRepository sang imageRepository
        if (exists) {
            throw new BadRequestException("Image with code " + requestDTO.getCode() + " and name " + requestDTO.getUrl() + " already exists."); // Đổi từ Elasticity sang Image
        }

        Image entityMapped = imageRequestMapper.toEntity(requestDTO); // Đổi từ Elasticity sang Image
        entityMapped.setDeleted(false);
        return imageRepository.save(entityMapped); // Đổi từ elasticityRepository sang imageRepository
    }

    @Override
    public Image update(Integer id, ImageRequestDTO requestDTO) throws BadRequestException { // Đổi từ Elasticity sang Image
        Image entityFound = findById(id); // Đổi từ Elasticity sang Image
        entityFound.setCode(requestDTO.getCode());
        entityFound.setUrl(requestDTO.getUrl());

        return imageRepository.save(entityFound); // Đổi từ elasticityRepository sang imageRepository
    }

    @Transactional
    public List<Image> saveAll(List<ImageRequestDTO> requestDTOList) { // Đổi từ Elasticity sang Image
        List<Image> entityMapped = imageRequestMapper.toListEntity(requestDTOList); // Đổi từ Elasticity sang Image
        return imageRepository.saveAll(entityMapped); // Đổi từ elasticityRepository sang imageRepository
    }

}