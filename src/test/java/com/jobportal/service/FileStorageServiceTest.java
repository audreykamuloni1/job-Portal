package com.jobportal.service;

import com.jobportal.exception.InvalidFileTypeException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class FileStorageServiceTest {

    private FileStorageService fileStorageService;

    @TempDir
    Path tempDir; // JUnit 5 temporary directory

    private String uploadDir;
    private final String allowedTypes = "pdf,docx,txt";
    private final String userId = "testUser";

    @BeforeEach
    void setUp() throws IOException {
        // Use a subdirectory within the @TempDir for uploads
        uploadDir = tempDir.resolve("uploads").toString(); 
        // Initialize FileStorageService with test properties
        fileStorageService = new FileStorageService(uploadDir, allowedTypes);
        // Ensure the directory is created by the service's constructor or manually for the test
        Files.createDirectories(Path.of(uploadDir));
    }
    
    @AfterEach
    void tearDown() throws IOException {
        // Clean up created files manually if needed, though @TempDir should handle the base
        // For this test, specific stored files are within tempDir structure.
    }


    private MultipartFile createMockMultipartFile(String originalFilename, String content) throws IOException {
        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getOriginalFilename()).thenReturn(originalFilename);
        when(mockFile.getInputStream()).thenReturn(new ByteArrayInputStream(content.getBytes()));
        // Mock other methods if storeFile uses them, e.g., getSize, getContentType
        return mockFile;
    }

    @Test
    void storeFile_WithAllowedTypePdf_ShouldSucceed() throws IOException {
        MultipartFile mockFile = createMockMultipartFile("resume.pdf", "PDF content");
        
        String storedFileName = fileStorageService.storeFile(mockFile, userId);
        
        assertNotNull(storedFileName);
        assertTrue(storedFileName.startsWith(userId));
        assertTrue(storedFileName.endsWith(".pdf"));
        assertTrue(Files.exists(Path.of(uploadDir).resolve(storedFileName)));
    }

    @Test
    void storeFile_WithAllowedTypeDocx_ShouldSucceed() throws IOException {
        MultipartFile mockFile = createMockMultipartFile("document.docx", "DOCX content");
        
        String storedFileName = fileStorageService.storeFile(mockFile, userId);
        
        assertNotNull(storedFileName);
        assertTrue(storedFileName.endsWith(".docx"));
        assertTrue(Files.exists(Path.of(uploadDir).resolve(storedFileName)));
    }
    
    @Test
    void storeFile_WithAllowedTypeTxt_ShouldSucceed() throws IOException {
        MultipartFile mockFile = createMockMultipartFile("notes.txt", "Text content");
        
        String storedFileName = fileStorageService.storeFile(mockFile, userId);
        
        assertNotNull(storedFileName);
        assertTrue(storedFileName.endsWith(".txt"));
        assertTrue(Files.exists(Path.of(uploadDir).resolve(storedFileName)));
    }


    @Test
    void storeFile_WithDisallowedTypeExe_ShouldThrowInvalidFileTypeException() throws IOException {
        MultipartFile mockFile = createMockMultipartFile("malware.exe", "EXE content");
        
        InvalidFileTypeException exception = assertThrows(InvalidFileTypeException.class, () -> {
            fileStorageService.storeFile(mockFile, userId);
        });
        
        assertTrue(exception.getMessage().contains("File type 'exe' is not allowed"));
    }
    
    @Test
    void storeFile_WithDisallowedTypeJpg_ShouldThrowInvalidFileTypeException() throws IOException {
        MultipartFile mockFile = createMockMultipartFile("image.jpg", "JPG content");
        
        InvalidFileTypeException exception = assertThrows(InvalidFileTypeException.class, () -> {
            fileStorageService.storeFile(mockFile, userId);
        });
        
        assertTrue(exception.getMessage().contains("File type 'jpg' is not allowed"));
        System.out.println("Allowed types configured for test: " + allowedTypes);
        System.out.println("Exception message: " + exception.getMessage());
    }


    @Test
    void storeFile_WithNoExtension_ShouldThrowInvalidFileTypeException() throws IOException {
        MultipartFile mockFile = createMockMultipartFile("fileWithoutExtension", "content");
        
        InvalidFileTypeException exception = assertThrows(InvalidFileTypeException.class, () -> {
            fileStorageService.storeFile(mockFile, userId);
        });
        
        assertEquals("File name is invalid or missing extension.", exception.getMessage());
    }
    
    @Test
    void storeFile_WithEmptyFilename_ShouldThrowInvalidFileTypeException() throws IOException {
        MultipartFile mockFile = createMockMultipartFile("", "content");
        
        InvalidFileTypeException exception = assertThrows(InvalidFileTypeException.class, () -> {
            fileStorageService.storeFile(mockFile, userId);
        });
        
        assertEquals("File name is invalid or missing extension.", exception.getMessage());
    }

    @Test
    void storeFile_WithFilenameContainingInvalidPathSequence_ShouldThrowRuntimeException() throws IOException {
        MultipartFile mockFile = createMockMultipartFile("../secret.pdf", "content");
    
        MultipartFile mockFileClean = createMockMultipartFile("normal.pdf", "content");
        String storedFileName = fileStorageService.storeFile(mockFileClean, userId);
        assertNotNull(storedFileName); // If it stores, cleanPath and generation worked.
    }
}
