package identity.server.backend.framework.exception;

import org.springframework.http.HttpStatus;
import java.util.List;

public class InternalServerException extends BaseException {
    private static final long serialVersionUID = 1L;

    public InternalServerException(Throwable rootCause) {
        super(rootCause);
    }

    public InternalServerException(String message) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public InternalServerException(String message, Throwable rootCause) {
        super(message, rootCause);
    }

    public InternalServerException(String message, HttpStatus statusCode, List<String> errorMessages) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, errorMessages);
    }
}