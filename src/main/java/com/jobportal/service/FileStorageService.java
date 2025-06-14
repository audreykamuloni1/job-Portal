package com.jobportal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import com.jobportal.exception.InvalidFileTypeException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final List<String> allowedFileTypes;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir,
                              @Value("${file.allowed-types}") String allowedTypes) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.allowedFileTypes = Arrays.stream(allowedTypes.split(","))
                                      .map(String::trim)
                                      .map(String::toLowerCase)
                                      .collect(Collectors.toList());
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file, String userId) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";

        if (originalFileName == null || originalFileName.isEmpty() || !originalFileName.contains(".")) {
            throw new InvalidFileTypeException("File name is invalid or missing extension.");
        }

        try {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1).toLowerCase();
        } catch (Exception e) {
            throw new InvalidFileTypeException("Could not determine file extension for file: " + originalFileName, e);
        }

        if (!allowedFileTypes.contains(fileExtension)) {
            throw new InvalidFileTypeException("File type '" + fileExtension + "' is not allowed. Allowed types are: " + String.join(", ", allowedFileTypes));
        }
        
        String storedFileName = userId + "_" + UUID.randomUUID().toString() + "." + fileExtension;

        try {
            if(storedFileName.contains("..")) {
                // This check is good, but StringUtils.cleanPath should already handle path traversal.
                // However, an explicit check for the generated name is also fine.
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + originalFileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return storedFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName + ". Please try again!", ex);
        }
    }
}
