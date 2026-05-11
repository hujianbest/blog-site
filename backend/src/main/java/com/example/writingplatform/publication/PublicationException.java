package com.example.writingplatform.publication;

public class PublicationException extends Exception {
    public PublicationException(String message) {
        super(message);
    }
    public PublicationException(String message, Throwable cause) {
        super(message, cause);
    }
}
