package com.audit.tracevault.infrastructure.exception;

import java.util.stream.Collectors;

import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.audit.tracevault.core.exception.FailedCryptographyException;
import com.audit.tracevault.core.exception.ResourceNotFoundException;
import com.audit.tracevault.core.exception.UnsupportedNotificationChannelException;
import com.audit.tracevault.infrastructure.adapters.in.web.dto.ApiErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiErrorResponse(false, ex.getMessage()));
    }

    @ExceptionHandler(UnsupportedNotificationChannelException.class)
    public ResponseEntity<ApiErrorResponse> handleUnsupportedNotificationChannel(UnsupportedNotificationChannelException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiErrorResponse(false, ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT)
            .body(new ApiErrorResponse(false, "Validation error: " + errorMessage));
    }

    @ExceptionHandler(FailedCryptographyException.class)
    public ResponseEntity<ApiErrorResponse> handleCryptography(FailedCryptographyException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiErrorResponse(false, "Cryptography error: " + ex.getMessage()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex) {

        Throwable cause = ex.getMostSpecificCause();

        if (cause instanceof java.sql.SQLException sqlEx) {

            String sqlState = sqlEx.getSQLState();

            if (sqlState != null) {
                switch (sqlState) {
                    case "23505": // unique_violation
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(new ApiErrorResponse(false, "Record already exists."));

                    case "23503": // foreign_key_violation
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(new ApiErrorResponse(false, "Foreign key violation."));

                    case "23502": // not_null_violation
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(new ApiErrorResponse(false, "Required field not provided."));
                }
            }
        }

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiErrorResponse(false, "Database integrity error."));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ApiErrorResponse> handleDatabase(DataAccessException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiErrorResponse(false, "Error accessing the database."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiErrorResponse(false, "Internal server error."));
    }
}