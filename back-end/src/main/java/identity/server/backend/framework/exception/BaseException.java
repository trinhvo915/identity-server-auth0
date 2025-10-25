package identity.server.backend.framework.exception;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.http.HttpStatus;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
public class BaseException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private HttpStatus statusCode;

    private String message;

    private List<String> errorMessages;

    @JsonIgnore
    private Throwable rootCause;

    public BaseException(Throwable rootCause){
        this.rootCause = rootCause;
    }

    public BaseException(String message){
        this.message = message;
    }

    public BaseException(String message, Throwable rootCause){
        this.message = message;
        this.rootCause = rootCause;
    }

    public BaseException(String message, HttpStatus statusCode){
        this.message = message;
        this.statusCode = statusCode;
    }

    public BaseException(String message, HttpStatus statusCode, List<String> errorMessages){
        this.message = message;
        this.statusCode = statusCode;
        this.errorMessages = errorMessages;
    }
}
