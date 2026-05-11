package com.example.writingplatform.exception;

public class OptimisticLockException extends RuntimeException {
    public OptimisticLockException(String message) {
        super(message);
    }
}
