package identity.server.backend.framework.exception;

import org.springframework.http.HttpStatus;

import java.util.List;

public class IORuntimeException extends BaseException {
    private static final long serialVersionUID = 1L;

    public IORuntimeException(Throwable rootCause) {
        super(rootCause);
    }

    public IORuntimeException(String message) {
        super(message);
    }

    public IORuntimeException(String message, Throwable rootCause) {
        super(message, rootCause);
    }

    public IORuntimeException(String message, HttpStatus statusCode) {
        super(message, statusCode);
    }

    public IORuntimeException(String message, HttpStatus statusCode, List<String> errorMessages) {
        super(message, statusCode, errorMessages);
    }
}
