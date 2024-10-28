package org.example.demo.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
public class FileUploadUtil {

    private final Path root = Paths.get("uploads");

    public String saveFile(String fileName, MultipartFile multipartFile, String code) throws IOException {
        if (!Files.exists(root)) {
            Files.createDirectories(root);
            log.info("Tạo thư muc thành công");
        }
        try {
            String nameFile = UUID.randomUUID().toString() + ".png";
            Files.copy(multipartFile.getInputStream(), this.root.resolve(nameFile));
            log.info("Lưu {} ảnh thành công", fileName);
            return nameFile;
        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new RuntimeException("A file of that name already exists.");
            }
            throw new RuntimeException(e.getMessage());
        }
    }


}