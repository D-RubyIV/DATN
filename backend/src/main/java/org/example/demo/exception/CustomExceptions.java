package org.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class CustomExceptions {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public static class ExistCodeException extends RuntimeException {
        public ExistCodeException(String message) {
            super(message);
        }
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public static class CustomBadRequest extends RuntimeException {
        public CustomBadRequest(String message) {
            super(message);
        }
    }

}
