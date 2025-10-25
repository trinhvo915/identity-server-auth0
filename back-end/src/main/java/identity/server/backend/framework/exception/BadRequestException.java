package identity.server.backend.framework.exception;

import org.springframework.http.HttpStatus;

import java.util.List;

public class BadRequestException extends BaseException {
    private static final long serialVersionUID = 1L;

    public BadRequestException(Throwable rootCause) {
        super(rootCause);
    }

    public BadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }

    public BadRequestException(String message, Throwable rootCause) {
        super(message, rootCause);
    }

    public BadRequestException(String message, List<String> errorMessages) {
        super(message, HttpStatus.BAD_REQUEST, errorMessages);
    }
}
