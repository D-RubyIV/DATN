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

    public static final Path root = Paths.get("uploads");

    public static String saveFile(String fileName, MultipartFile multipartFile) throws IOException {
        if (!Files.exists(root)) {
            Files.createDirectories(root);
            log.info("Tạo thư muc thành công");
        }
        try {
            String nameFile = UUID.randomUUID().toString() + ".png";
            Files.copy(multipartFile.getInputStream(), root.resolve(nameFile));
            log.info("Lưu {} ảnh thành công", fileName);
            return nameFile;
        } catch (Exception e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new RuntimeException("A file of that name already exists.");
            }
            throw new RuntimeException(e.getMessage());
        }
    }

    public static File getFile(String fileName) {
        Path filePath = root.resolve(fileName);
        File file = filePath.toFile();

        if (!file.exists()) {
            throw new RuntimeException("File not found.");
        }

        return file;
    }



}