package org.example.demo.service.staff;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.demo.dto.staff.request.StaffRequestDTO;
import org.example.demo.dto.staff.response.StaffResponseDTO;
import org.example.demo.entity.human.staff.Staff;
import org.example.demo.mapper.staff.request.StaffRequestMapper;
import org.example.demo.mapper.staff.response.StaffResponseMapper;
import org.example.demo.repository.staff.StaffRepository;
import org.example.demo.validator.staff.StaffValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Slf4j
@Service
public class StaffService implements IService1<Staff, Integer, StaffRequestDTO> {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private StaffResponseMapper staffResponseMapper;

    @Autowired
    private StaffRequestMapper staffRequestMapper;

    @Autowired
    private StaffValidator staffValidator;

    @Override
    public Page<StaffResponseDTO> findAllByPage(String code, String name, LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Staff> query = cb.createQuery(Staff.class);
        Root<Staff> root = query.from(Staff.class);

        List<Predicate> predicates = buildSearchPredicates(cb, root, code, name, fromDate, toDate);
        query.where(predicates.toArray(new Predicate[0]));

        applySorting(cb, query, root, pageable);

        return executePagedQuery(query, predicates, pageable);
    }

    public Page<Staff> searchNhanVien(String keyword, String hoTen, String sdt, String ma, String email, String trangThai, String cccd, int limit, int offset) {
        Pageable pageable = PageRequest.of(offset / limit, limit);
        return staffRepository.searchNhanVien(keyword, hoTen, sdt, ma, email, trangThai, cccd, pageable);
    }

    public Page<Staff> getAllStaffs(int limit, int offset) {
        return staffRepository.findAll(PageRequest.of(offset / limit, limit));
    }

    private List<Predicate> buildSearchPredicates(CriteriaBuilder cb, Root<Staff> root, String code, String name, LocalDateTime fromDate, LocalDateTime toDate) {
        List<Predicate> predicates = new ArrayList<>();
        if (code != null && !code.isEmpty()) {
            predicates.add(cb.equal(root.get("code"), code));
        }
        if (name != null && !name.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }
        if (fromDate != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("birthDay"), fromDate));
        }
        if (toDate != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("birthDay"), toDate));
        }
        return predicates;
    }

    private void applySorting(CriteriaBuilder cb, CriteriaQuery<Staff> query, Root<Staff> root, Pageable pageable) {
        List<Order> orders = new ArrayList<>();
        for (Sort.Order sortOrder : pageable.getSort()) {
            Path<Object> path = root.get(sortOrder.getProperty());
            Order order = sortOrder.isAscending() ? cb.asc(path) : cb.desc(path);
            orders.add(order);
        }
        query.orderBy(orders);
    }

    private Page<StaffResponseDTO> executePagedQuery(CriteriaQuery<Staff> query, List<Predicate> predicates, Pageable pageable) {
        Long totalRecords = getCount(predicates);
        TypedQuery<Staff> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<Staff> resultList = typedQuery.getResultList();
        return new PageImpl<>(staffResponseMapper.toListDTO(resultList), pageable, totalRecords);
    }

    private Long getCount(List<Predicate> predicates) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Staff> countRoot = countQuery.from(Staff.class);
        countQuery.select(cb.count(countRoot)).where(predicates.toArray(new Predicate[0]));
        return entityManager.createQuery(countQuery).getSingleResult();
    }


    public Staff findById(Integer id) {
        return staffRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Staff with id " + id + " not found"));
    }

    private static final String DEFAULT_NV = "default";
    private static final Random RANDOM = new Random();

    private String removeVietnameseTones(String str) {
        if (str == null) {
            return null;
        }
        // Xóa dấu tiếng Việt
        str = Normalizer.normalize(str, Normalizer.Form.NFD);
        str = str.replaceAll("[\\u0300-\\u036f]", ""); // Chú ý: bỏ dấu / ở đây
        return str.replace('đ', 'd').replace('Đ', 'D');
    }

    private String generateRandomMaNV(String name) {
        if (name == null || name.isEmpty()) {
            int randomMa = 100 + RANDOM.nextInt(800);
            return DEFAULT_NV + randomMa;
        }

        name = removeVietnameseTones(name.trim());
        String[] nameParts = name.split("\\s+");

        if (nameParts.length < 2) {
            int randomMa = 100 + RANDOM.nextInt(800);
            return DEFAULT_NV + randomMa;
        }

        String ho = nameParts[0].substring(0, 1).toLowerCase(); // Chữ cái đầu của họ
        String ten = nameParts[nameParts.length - 1].toLowerCase(); // Tên
        StringBuilder tenDem = new StringBuilder();

        // Lấy chữ cái đầu của tên đệm nếu có
        for (int i = 1; i < nameParts.length - 1; i++) {
            tenDem.append(nameParts[i].substring(0, 1).toLowerCase());
        }

        // Tạo tên viết tắt theo thứ tự: tên + họ + tên đệm
        String nameInitials = ten + ho + tenDem.toString();
        int randomMa = 100 + RANDOM.nextInt(800); // Mã ngẫu nhiên từ 100 đến 899

        return nameInitials + randomMa; // Kết quả cuối cùng
    }

    private String generateRandomPassword() {
        int randomPassword = 10000 + new Random().nextInt(90000);
        return String.valueOf(randomPassword);
    }

    @Override
    @Transactional
    public Staff delete(Integer id) throws BadRequestException {
        Staff entityFound = findById(id);
        entityFound.setDeleted(true);
        return staffRepository.save(entityFound);
    }

    @Override
    @Transactional
    public Staff save(StaffRequestDTO requestDTO) throws BadRequestException {
        staffValidator.validateStaff(requestDTO, null);
        Staff entityMapped = staffRequestMapper.toEntity(requestDTO);
        entityMapped.setStatus("Active");
        entityMapped.setCode(generateRandomMaNV(requestDTO.getName()));
        entityMapped.setPassword(generateRandomPassword());
        entityMapped.setDeleted(false);
        return staffRepository.save(entityMapped);
    }

    @Override
    @Transactional
    public StaffResponseDTO update(Integer id, StaffRequestDTO requestDTO) throws BadRequestException {
        Staff existingStaff = staffRepository.findById(id).orElseThrow(() -> new RuntimeException("Staff with id " + id + " not found"));
        staffValidator.validateStaff(requestDTO, id);
        staffRequestMapper.updateEntity(requestDTO, existingStaff);
        Staff updatedStaff = staffRepository.save(existingStaff);
        return staffResponseMapper.toDTO(updatedStaff);
    }

    @Transactional
    public StaffResponseDTO getStaffResponseDTO(Staff staff) {
        return staffResponseMapper.toDTO(staff);
    }

    @Transactional
    public Staff updateStatus(Integer id, String newStatus) {
        if (!"Active".equalsIgnoreCase(newStatus) && !"Inactive".equalsIgnoreCase(newStatus)) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }
        Staff staff = staffRepository.findById(id).orElseThrow(() -> new RuntimeException("Staff with id " + id + " not found"));
        staff.setStatus(newStatus);
        return staffRepository.save(staff);
    }

    @Transactional
    public List<Map<String, String>> importFromExcel(MultipartFile file) throws IOException {
        List<Map<String, String>> responseList = new ArrayList<>(); // Danh sách chứa mã và mật khẩu
        List<Staff> staffList = new ArrayList<>(); // Danh sách nhân viên để lưu vào DB

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);

            // Bắt đầu từ dòng thứ 2 (index = 1) để bỏ qua tiêu đề
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                // Khởi tạo đối tượng Staff và gán dữ liệu từ Excel
                Staff staff = new Staff();
                staff.setName(getCellValue(row.getCell(1)));
                staff.setEmail(getCellValue(row.getCell(2)));
                staff.setPhone(getCellValue(row.getCell(3)));
                staff.setAddress(getCellValue(row.getCell(4)));
                staff.setWard(getCellValue(row.getCell(5)));
                staff.setDistrict(getCellValue(row.getCell(6)));
                staff.setProvince(getCellValue(row.getCell(7)));
                staff.setCitizenId(getCellValue(row.getCell(8)));
                String statusValue = getCellValue(row.getCell(9)).trim(); // Lấy giá trị từ ô và loại bỏ khoảng trắng
                String statusString;

// Chuyển đổi giá trị trạng thái
                if ("Hoạt động".equalsIgnoreCase(statusValue)) {
                    statusString = "Active"; // Nếu trạng thái là "Hoạt động", lưu là "Active"
                } else if ("Không hoạt động".equalsIgnoreCase(statusValue)) {
                    statusString = "Inactive"; // Nếu trạng thái là "Không hoạt động", lưu là "Inactive"
                } else if ("Active".equalsIgnoreCase(statusValue)) {
                    statusString = "Active"; // Nếu trạng thái là "Active", lưu là "Active"
                } else {
                    statusString = "Inactive"; // Nếu không phải là "Hoạt động" hoặc "Active", mặc định là "Inactive"
                }

// Set giá trị trạng thái cho staff
                staff.setStatus(statusString);


                if (row.getCell(10) != null && DateUtil.isCellDateFormatted(row.getCell(10))) {
                    LocalDate birthDate = row.getCell(10).getDateCellValue().toInstant()
                            .atZone(ZoneId.systemDefault()).toLocalDate();
                    staff.setBirthDay(birthDate);
                }

                staff.setGender("Nam".equalsIgnoreCase(getCellValue(row.getCell(11))));

                staff.setNote(getCellValue(row.getCell(12)));
                staff.setDeleted("Không".equalsIgnoreCase(getCellValue(row.getCell(13))));


                // Tạo mã nhân viên và mật khẩu
                String code = generateRandomMaNV(staff.getName());
                String password = generateRandomPassword();
                staff.setCode(code);
                staff.setPassword(password);

                // Thêm mã và mật khẩu vào danh sách phản hồi
                Map<String, String> responseData = new HashMap<>();
                responseData.put("name", staff.getName());
                responseData.put("email", staff.getEmail());
                responseData.put("code", code);
                responseData.put("password", password);
                responseList.add(responseData);

                // Thêm nhân viên vào danh sách để lưu vào DB
                staffList.add(staff);
            }

            // Lưu tất cả nhân viên vào DB
            staffRepository.saveAll(staffList);
        }

        // Trả về danh sách mã và mật khẩu
        return responseList;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return null;

        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getDateCellValue().toString();
                } else {
                    yield String.valueOf((long) cell.getNumericCellValue());
                }
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> "";
        };
    }

    public boolean isEmailExists(String email) {
        return staffValidator.isEmailExists(email);
    }

    public boolean isPhoneExists(String phone) {
        return staffValidator.isPhoneExists(phone);
    }

    public boolean isCitizenIdExists(String citizenId) {
        return staffValidator.isCitizenIdExists(citizenId);
    }

}