package identity.server.backend.framework.exception;

import org.springframework.http.HttpStatus;
import java.util.List;

public class ForbiddenException extends BaseException {
    private static final long serialVersionUID = 1L;

    public ForbiddenException(Throwable rootCause) {
        super(rootCause);
    }

    public ForbiddenException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }

    public ForbiddenException(String message, Throwable rootCause) {
        super(message, rootCause);
    }

    public ForbiddenException(String message, HttpStatus statusCode, List<String> errorMessages) {
        super(message, HttpStatus.FORBIDDEN, errorMessages);
    }
}