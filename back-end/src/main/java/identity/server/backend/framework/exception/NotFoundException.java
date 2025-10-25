package identity.server.backend.framework.exception;

import org.springframework.http.HttpStatus;

import java.util.List;

public class NotFoundException extends BaseException {
    private static final long serialVersionUID = 1L;

    public NotFoundException(Throwable rootCause) {
        super(rootCause);
    }

    public NotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }

    public NotFoundException(String message, Throwable rootCause) {
        super(message, rootCause);
    }

    public NotFoundException(String message, HttpStatus statusCode, List<String> errorMessages) {
        super(message, HttpStatus.NOT_FOUND, errorMessages);
    }
}
