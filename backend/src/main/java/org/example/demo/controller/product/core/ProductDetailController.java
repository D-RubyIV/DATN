package org.example.demo.controller.product.core;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.dto.product.phah04.request.FindProductDetailRequest;
import org.example.demo.dto.product.phah04.response.ProductClientResponse;
import org.example.demo.dto.product.requests.core.ProductDetailRequestDTO;
import org.example.demo.dto.product.response.core.ProductDetailResponseDTO;
import org.example.demo.dto.product.response.properties.ProductResponseDTO;
import org.example.demo.dto.product.response.properties.ProductResponseOverDTO;
import org.example.demo.entity.product.core.ProductDetail;
import org.example.demo.entity.product.properties.Image;
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.example.demo.service.product.core.ProductDetailService;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("productDetails")
public class ProductDetailController {

    @Autowired
    private ProductDetailRepository productDetailRepository; // dung nhanh tam

    @Autowired
    private ProductDetailService productDetailService;

    @GetMapping("")
    public ResponseEntity<Page<ProductDetail>> findAll(Pageable pageable) {
        Page<ProductDetail> productDetails = productDetailService.findAll(pageable);
        return ResponseEntity.ok(productDetails);
    }

    @GetMapping("/client")
    public org.example.demo.infrastructure.common.PageableObject findAll(FindProductDetailRequest request) {
        return (org.example.demo.infrastructure.common.PageableObject) productDetailService.getAll(request);
    }

    @PostMapping(value = "details")
    public ResponseEntity<Page<ProductDetailResponseDTO>> getProductDetails(
            @RequestParam(required = false) Integer productId,
            @RequestParam(value = "createdFrom", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdFrom,
            @RequestParam(value = "createdTo", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDateTime createdTo,
            @Valid @RequestBody PageableObject pageableObject,
            BindingResult bindingResult
    ) throws BindException {
        // Kiểm tra lỗi
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }

        System.out.println("productId: " + productId);
        System.out.println("createdFrom: " + createdFrom);
        System.out.println("createdTo: " + createdTo);
        System.out.println("pageableObject: " + pageableObject);

        // Gọi dịch vụ để lấy dữ liệu sản phẩm
        Page<ProductDetailResponseDTO> productDetails = productDetailService.findAllProductDetailsOverviewByPage(
                productId,
                createdFrom,
                createdTo,
                pageableObject
        );

        return ResponseEntity.ok(productDetails);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProductDetail> findById(@PathVariable Integer id) {
        try {
            ProductDetail productDetail = productDetailService.findById(id);
            return ResponseEntity.ok(productDetail);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }

    @PostMapping("save")
    public ResponseEntity<ProductDetail> save(@Valid @RequestBody ProductDetailRequestDTO requestDTO) {
        try {
            ProductDetail savedProductDetail = productDetailService.save(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProductDetail);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
    }

    @PutMapping("update/{id}")
    public ResponseEntity<ProductDetail> update(@PathVariable Integer id, @Valid @RequestBody ProductDetailRequestDTO requestDTO) {
        try {
            ProductDetail updatedProductDetail = productDetailService.update(id, requestDTO);
            return ResponseEntity.ok(updatedProductDetail);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        try {
            productDetailService.delete(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("saveAll")
    public ResponseEntity<List<ProductDetail>> saveAll(@Valid @RequestBody List<ProductDetailRequestDTO> requestDTOList) {
        System.out.println("--------------------");
        try {
            List<ProductDetail> savedProductDetails = productDetailService.saveAll(requestDTOList);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProductDetails);
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // trc b inject foken vao moi cai request kj ti chi toi phat
    @GetMapping("abc")
    public ResponseEntity<?> custome(@PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<ProductResponseOverDTO> page = productDetailRepository.findCustom(pageable);
        List<ProductResponseOverDTO> productList = page.getContent(); // log cho nay xem hinh nhu chua lay dc list van size 0 no ra IDS[2, 51] r, tooi dang join ko phai left join nen no ra its, tis suaw okeee
        List<Integer> productIds = productList.stream().map(ProductResponseOverDTO::getProductId).toList();
        System.out.println("IDS" + productIds);
        List<ProductDetail> listProductDetail = productDetailRepository.findAllByProductIdCustom(productIds);
        System.out.println("listProductDetail SIZE " + listProductDetail.size());


        productList.forEach(s -> {
            Integer idPro = s.getProductId();
            List<ProductDetail> listProd = listProductDetail.stream().filter(p -> p.getProduct().getId().equals(idPro)).toList();
            System.out.println("listProductDetail 2" + listProd.size());
            List<Image> productImages = new ArrayList<>();
            listProd.forEach(pd -> {
                System.out.println(pd.getCode());
                System.out.println("-------");
                productImages.addAll(pd.getImages());  // Thêm tất cả hình ảnh của mỗi sản phẩm vào productImages
            });

            s.setImage(productImages.stream().map(Image::getUrl).toList());
        });
        PageImpl<ProductResponseOverDTO> pageResponse = new PageImpl<>(productList, pageable, page.getTotalElements());
        return ResponseEntity.ok(pageResponse);

    }

    @GetMapping("abc/{id}")
    public ResponseEntity<?> getOne(@PathVariable("id") Integer id) {
        Optional<ProductResponseOverDTO> productResponseOverDTOOptional = productDetailRepository.findOneCustom(id);
        if (productResponseOverDTOOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        ProductResponseOverDTO productResponseOverDTO = productResponseOverDTOOptional.get();
        List<ProductDetail> listProductDetail = productDetailRepository.findAllByProductIdCustom(List.of(id));
        List<Image> productImages = new ArrayList<>();
        listProductDetail.forEach(pd -> {
            productImages.addAll(pd.getImages());
        });
        productResponseOverDTO.setImage(productImages.stream().map(Image::getUrl).toList());
        return ResponseEntity.ok(productResponseOverDTO);
    }

}

