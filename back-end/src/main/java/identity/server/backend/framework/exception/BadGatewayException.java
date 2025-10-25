package identity.server.backend.framework.exception;

import org.springframework.http.HttpStatus;
import java.util.List;

public class BadGatewayException  extends BaseException {
    private static final long serialVersionUID = 1L;

    public BadGatewayException(Throwable rootCause) {
        super(rootCause);
    }

    public BadGatewayException(String message) {
        super(message, HttpStatus.BAD_GATEWAY);
    }

    public BadGatewayException(String message, Throwable rootCause) {
        super(message, rootCause);
    }

    public BadGatewayException(String message, HttpStatus statusCode, List<String> errorMessages) {
        super(message, HttpStatus.BAD_GATEWAY, errorMessages);
    }
}