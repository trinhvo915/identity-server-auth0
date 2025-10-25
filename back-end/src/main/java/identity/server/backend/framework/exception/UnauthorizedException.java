package identity.server.backend.framework.exception;

import org.springframework.http.HttpStatus;

import java.util.List;

public class UnauthorizedException  extends BaseException {
    private static final long serialVersionUID = 1L;

    public UnauthorizedException(Throwable rootCause) {
        super(rootCause);
    }

    public UnauthorizedException(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }

    public UnauthorizedException(String message, Throwable rootCause) {
        super(message, rootCause);
    }

    public UnauthorizedException(String message, HttpStatus statusCode, List<String> errorMessages) {
        super(message, HttpStatus.UNAUTHORIZED, errorMessages);
    }
}
