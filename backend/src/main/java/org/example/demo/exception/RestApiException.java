package org.example.demo.exception;

import org.example.demo.infrastructure.constant.Message;

public class RestApiException extends RuntimeException{
    private static final long serialVersionUID = 1L;

    private String message;

    public RestApiException() {
    }

    public RestApiException(Message statusCode) {
        this.message = statusCode.getMessage();
    }

    public RestApiException(String message) {
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}

