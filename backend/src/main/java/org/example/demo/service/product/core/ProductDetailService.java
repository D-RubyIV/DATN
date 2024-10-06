package org.example.demo.service.product.core;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.core.ProductDetailRequestDTO;
import org.example.demo.dto.product.response.core.ProductDetailResponseDTO;
import org.example.demo.dto.product.response.properties.ProductResponseDTO;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.product.properties.Brand;
import org.example.demo.mapper.product.request.core.ProductDetailRequestMapper;
import org.example.demo.mapper.product.response.core.ProductDetailResponseMapper;
import org.example.demo.mapper.product.response.properties.ProductResponseMapper;
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.example.demo.repository.product.properties.BrandRepository;
import org.example.demo.service.IService;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductDetailService implements IService<ProductDetail, Integer, ProductDetailRequestDTO> {

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ProductDetailRequestMapper productDetailRequestMapper;

    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private ProductDetailResponseMapper productDetailResponseMapper;

    public Page<ProductDetail> findAll(Pageable pageable) {
        return productDetailRepository.findAll(pageable);
    }

    public Page<ProductDetailResponseDTO> findAllProductDetailsOverviewByPage(
            Integer productId,
            LocalDate createdFrom,
            LocalDate createdTo,
            PageableObject pageableObject
    ) {
        Pageable pageable = pageableObject.toPageRequest();
        String query = pageableObject.getQuery();
        // Boolean deleted = pageableObject.getDeleted(); // Uncomment if using the deleted filter

        return productDetailRepository.findAllByProductIdWithQuery(
                productId,
                query,
                // deleted, // Uncomment if using the deleted filter
                createdFrom,
                createdTo,
                pageable
        ).map(s -> productDetailResponseMapper.toDTO(s)); // Add the closing parenthesis here

    }



    @Override
    public ProductDetail findById(Integer id) throws BadRequestException {
        return productDetailRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("ProductDetail not found with id: " + id));
    }

    @Override
    public ProductDetail delete(Integer id) throws BadRequestException {
        ProductDetail entityFound = findById(id);
        entityFound.setDeleted(true);
        return productDetailRepository.save(entityFound);
    }

    @Override
    public ProductDetail save(ProductDetailRequestDTO requestDTO) throws BadRequestException {
        return handleProductDetailSave(requestDTO);
    }

    @Override
    public ProductDetail update(Integer id, ProductDetailRequestDTO requestDTO) throws BadRequestException {
        ProductDetail entityFound = findById(id);
        return handleProductDetailUpdate(entityFound, requestDTO);
    }

    @Transactional
    public List<ProductDetail> saveAll(List<ProductDetailRequestDTO> requestDTOList) throws BadRequestException {
        List<ProductDetail> savedProductDetails = new ArrayList<>();

        for (ProductDetailRequestDTO requestDTO : requestDTOList) {
            ProductDetail existingProductDetail = productDetailRepository.findByName( requestDTO.getName());

            if (existingProductDetail != null) {
                if (isProductDetailDuplicate(existingProductDetail, requestDTO)) {
                    existingProductDetail.setQuantity(existingProductDetail.getQuantity() + requestDTO.getQuantity());
                    savedProductDetails.add(productDetailRepository.save(existingProductDetail));
                } else {
                    savedProductDetails.add(existingProductDetail);
                }
            } else {
                ProductDetail entityMapped = productDetailRequestMapper.toEntity(requestDTO);
                Brand brand = brandRepository.findById(requestDTO.getBrand().getId())
                        .orElseThrow(() -> new BadRequestException("Brand not found"));
                entityMapped.setBrand(brand);
                entityMapped.setDeleted(false);
                savedProductDetails.add(productDetailRepository.save(entityMapped));
            }
        }

        return savedProductDetails;
    }

    @Transactional
    public ProductDetail handleProductDetailSave(ProductDetailRequestDTO requestDTO) throws BadRequestException {
        ProductDetail existingProductDetail = productDetailRepository.findByCodeAndName(requestDTO.getCode(), requestDTO.getName());

        if (existingProductDetail != null && isProductDetailDuplicate(existingProductDetail, requestDTO)) {
            existingProductDetail.setQuantity(existingProductDetail.getQuantity() + requestDTO.getQuantity());
            return productDetailRepository.save(existingProductDetail);
        }

        ProductDetail entityMapped = productDetailRequestMapper.toEntity(requestDTO);
        Brand brand = brandRepository.findById(requestDTO.getBrand().getId())
                .orElseThrow(() -> new BadRequestException("Brand not found"));
        entityMapped.setBrand(brand);
        entityMapped.setDeleted(false);

        return productDetailRepository.save(entityMapped);
    }

    private ProductDetail handleProductDetailUpdate(ProductDetail entityFound, ProductDetailRequestDTO requestDTO)  {
        ProductDetail existingProductDetail = productDetailRepository.findByCodeAndName(requestDTO.getCode(), requestDTO.getName());

        if (existingProductDetail != null && isProductDetailDuplicate(existingProductDetail, requestDTO) && !existingProductDetail.getId().equals(entityFound.getId())) {
            entityFound.setQuantity(entityFound.getQuantity() + requestDTO.getQuantity());
        } else {
            entityFound.setQuantity(requestDTO.getQuantity());
        }

        updateEntityFromRequest(entityFound, requestDTO);
        return productDetailRepository.save(entityFound);
    }

    private boolean isProductDetailDuplicate(ProductDetail existingProductDetail, ProductDetailRequestDTO requestDTO) {
        return existingProductDetail != null &&
                existingProductDetail.getName().equals(requestDTO.getName()) && // Check only name
                existingProductDetail.getSize().equals(requestDTO.getSize()) &&
                existingProductDetail.getProduct().equals(requestDTO.getProduct()) &&
                existingProductDetail.getColor().equals(requestDTO.getColor()) &&
                existingProductDetail.getTexture().equals(requestDTO.getTexture()) &&
                existingProductDetail.getOrigin().equals(requestDTO.getOrigin()) &&
                existingProductDetail.getBrand().equals(requestDTO.getBrand()) &&
                existingProductDetail.getCollar().equals(requestDTO.getCollar()) &&
                existingProductDetail.getSleeve().equals(requestDTO.getSleeve()) &&
                existingProductDetail.getStyle().equals(requestDTO.getStyle()) &&
                existingProductDetail.getMaterial().equals(requestDTO.getMaterial()) &&
                existingProductDetail.getThickness().equals(requestDTO.getThickness()) &&
                existingProductDetail.getElasticity().equals(requestDTO.getElasticity());
    }

    private void updateEntityFromRequest(ProductDetail entity, ProductDetailRequestDTO requestDTO) {
        entity.setCode(requestDTO.getCode());
        entity.setName(requestDTO.getName());
        entity.setPrice(requestDTO.getPrice());
        entity.setDeleted(requestDTO.getDeleted());
        // Update other properties as needed
    }
}
