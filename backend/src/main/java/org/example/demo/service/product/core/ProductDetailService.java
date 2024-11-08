package org.example.demo.service.product.core;

import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.requests.core.ProductDetailRequestDTO;
import org.example.demo.dto.product.requests.properties.ImageRequestDTO;
import org.example.demo.dto.product.response.core.ProductDetailResponseDTO;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.product.properties.Brand;
import org.example.demo.entity.product.properties.Image;
import org.example.demo.mapper.product.request.core.ProductDetailRequestMapper;
import org.example.demo.mapper.product.response.core.ProductDetailResponseMapper;
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.example.demo.repository.product.properties.BrandRepository;
import org.example.demo.repository.product.properties.ImageRepository;
import org.example.demo.service.IService;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductDetailService implements IService<ProductDetail, Integer, ProductDetailRequestDTO> {

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private ProductDetailRequestMapper productDetailRequestMapper;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ProductDetailResponseMapper productDetailResponseMapper;

    @Autowired
    private ImageRepository imageRepository;


    @Override
    public ProductDetail findById(Integer id) throws BadRequestException {
        return productDetailRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("ProductDetail not found with id: " + id));
    }

    public Page<ProductDetail> findAll(Pageable pageable) {
        return productDetailRepository.findAll(pageable);
    }

    // Phương thức tìm tất cả sản phẩm chi tiết với điều kiện phân trang
    public Page<ProductDetailResponseDTO> findAllProductDetailsOverviewByPage(
            Integer productId,
            LocalDateTime createdFrom,
            LocalDateTime createdTo,
            PageableObject pageableObject
    ) {
        Pageable pageable = pageableObject.toPageRequest();
        String query = pageableObject.getQuery();

        Page<ProductDetail> productDetails = productDetailRepository.findAllByProductIdWithQuery(
                productId,
                query,
                createdFrom,
                createdTo,
                pageable
        );

        return productDetails.map(s -> productDetailResponseMapper.toDTO(s));
    }

    @Override
    public ProductDetail delete(Integer id) throws BadRequestException {
        ProductDetail entityFound = findById(id);
        entityFound.setDeleted(true);
        return productDetailRepository.save(entityFound);
    }


    @Override
    public ProductDetail save(ProductDetailRequestDTO requestDTO) throws BadRequestException {
        return null;
    }

    @Override
    public ProductDetail update(Integer integer, ProductDetailRequestDTO requestDTO) throws BadRequestException {
        return null;
    }
    @Transactional
    public List<ProductDetail> saveAll(List<ProductDetailRequestDTO> requestDTOs) throws BadRequestException {
        List<ProductDetail> savedProductDetails = new ArrayList<>();

        // Duyệt qua từng sản phẩm trong danh sách và xử lý từng sản phẩm
        for (ProductDetailRequestDTO requestDTO : requestDTOs) {
            // Kiểm tra và xử lý từng sản phẩm chi tiết
            ProductDetail savedProductDetail = handleProductDetailSave(requestDTO);
            savedProductDetails.add(savedProductDetail);
        }

        return savedProductDetails;
    }

    private ProductDetail handleProductDetailSave(ProductDetailRequestDTO requestDTO) throws BadRequestException {
        // Kiểm tra xem sản phẩm chi tiết đã tồn tại với mã và tên không
        ProductDetail existingProductDetail = productDetailRepository.findByName(requestDTO.getCode(), requestDTO.getSize(),requestDTO.getColor());

        // Nếu sản phẩm đã tồn tại và không phải là trùng lặp, cộng thêm số lượng
        if (existingProductDetail != null && isProductDetailDuplicate(existingProductDetail, requestDTO)) {
            existingProductDetail.setQuantity(existingProductDetail.getQuantity() + requestDTO.getQuantity());
            return productDetailRepository.save(existingProductDetail);
        }

        // Nếu không tồn tại, tạo mới sản phẩm chi tiết
        ProductDetail entityMapped = productDetailRequestMapper.toEntity(requestDTO);

        // Kiểm tra và gán thương hiệu cho sản phẩm
        Brand brand = brandRepository.findById(requestDTO.getBrand().getId())
                .orElseThrow(() -> new BadRequestException("Brand not found"));
        entityMapped.setBrand(brand);
        entityMapped.setDeleted(false); // Mặc định là chưa xóa

        // Lưu ảnh vào cơ sở dữ liệu nếu có
        if (requestDTO.getImages() != null && !requestDTO.getImages().isEmpty()) {
            List<Image> images = createImagesFromDTO(requestDTO.getImages());
            entityMapped.setImages(images);
        }

        // Lưu sản phẩm chi tiết vào cơ sở dữ liệu
        return productDetailRepository.save(entityMapped);
    }

    private boolean isProductDetailDuplicate(ProductDetail existingProductDetail, ProductDetailRequestDTO requestDTO) {
        return existingProductDetail != null &&
                existingProductDetail.getName().equals(requestDTO.getName()) &&
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

private List<Image> createImagesFromDTO(List<ImageRequestDTO> imageRequestDTOs) {
        return imageRequestDTOs.stream().map(imageRequestDTO -> {
            System.out.println(imageRequestDTO.toString());
            Image image = new Image();
            image.setCode(imageRequestDTO.getCode());
            image.setUrl(imageRequestDTO.getUrl());
            image.setDeleted(imageRequestDTO.getDeleted());
            return imageRepository.save(image);
        }).collect(Collectors.toList());
    }


}
