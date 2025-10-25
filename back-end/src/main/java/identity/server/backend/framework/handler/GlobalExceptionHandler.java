package identity.server.backend.framework.handler;

import static java.util.stream.Collectors.toList;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.CompletionException;
import java.util.stream.StreamSupport;
import identity.server.backend.framework.exception.BadRequestException;
import identity.server.backend.framework.exception.NotFoundException;
import identity.server.backend.framework.handler.model.FieldError;
import identity.server.backend.framework.handler.model.ResponseData;
import identity.server.backend.framework.support.ResponseSupport;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MultipartException;

@RestControllerAdvice
@Component
public class GlobalExceptionHandler {

    private final Logger logErr = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private final ResponseSupport responseSupport;

    public GlobalExceptionHandler(ResponseSupport responseSupport) {
        this.responseSupport = responseSupport;
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ResponseData> handleAuthenticationException(AuthenticationException exception) {
        logErr.error(exception.getMessage(), exception);
        return responseSupport.failed(HttpStatus.UNAUTHORIZED, exception.getMessage());
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<ResponseData> handleInsufficientAuthenticationException(InsufficientAuthenticationException exception) {
        logErr.error(exception.getMessage(), exception);
        return responseSupport.failed(HttpStatus.UNAUTHORIZED, exception.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ResponseData> handleRuntimeException(RuntimeException exception) {
        logErr.error(exception.getMessage(), exception);
        return responseSupport.failed(HttpStatus.INTERNAL_SERVER_ERROR, exception.getMessage());
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<ResponseData> handleIOException(IOException exception) {
        logErr.error(exception.getMessage(), exception);
        return responseSupport.failed(HttpStatus.INTERNAL_SERVER_ERROR, exception.getMessage());
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ResponseData> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException exception) {
        logErr.error(exception.getMessage(), exception);
        return responseSupport.failed(HttpStatus.METHOD_NOT_ALLOWED, exception.getMessage());
    }

    @ExceptionHandler(ServletRequestBindingException.class)
    public ResponseEntity<ResponseData> handleServletRequestBindingException(ServletRequestBindingException exception) {
        logErr.error(exception.getMessage(), exception);
        return responseSupport.failed(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ResponseData> handleAccessDeniedException(AccessDeniedException exception) {
        logErr.error(exception.getMessage(), exception);
        return responseSupport.failed(HttpStatus.UNAUTHORIZED, exception.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ResponseData> handleHttpMessageNotReadableException(HttpMessageNotReadableException exception) {
        logErr.error(exception.getMessage(), exception);
        return responseSupport.failed(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ResponseData> handleHttpMediaTypeNotSupportedException(HttpMediaTypeNotSupportedException exception) {
        logErr.error(exception.getMessage(), exception);
        return responseSupport.failed(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseData> handleException(Exception exception) {
        logErr.error(exception.getMessage(), exception);
        return responseSupport.failed(HttpStatus.INTERNAL_SERVER_ERROR, exception.getMessage());
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ResponseData> handleBindException(BindException ex) {
        logErr.error(ex.getMessage(), ex);
        BindingResult result = ex.getBindingResult();
        List<FieldError> filedErrs = result
                .getFieldErrors()
                .stream()
                .map(f ->
                        new FieldError(
                                f.getField(),
                                StringUtils.isNotBlank(f.getDefaultMessage())
                                        ? f.getDefaultMessage()
                                        : f.getCode()
                        )
                )
                .collect(toList());

        if (filedErrs.isEmpty()) {
            return responseSupport.failed(HttpStatus.BAD_REQUEST, ex.getMessage());
        }

        return responseSupport.failed(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                filedErrs
        );
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ResponseData> handleBadRequestException(BadRequestException exception) {
        logErr.error(exception.getMessage(), exception);
        return responseSupport.failed(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ResponseData> handleNotFoundException(NotFoundException exception) {
        logErr.error(exception.getMessage(), exception);
        return responseSupport.failed(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ResponseData> handleBadCredentialsException(BadCredentialsException exception) {
        logErr.error(exception.getMessage(), exception);
        return responseSupport.failed(HttpStatus.UNAUTHORIZED, exception.getMessage());
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ResponseData> handleConstraintViolationException(ConstraintViolationException exception) {
        logErr.error(exception.getMessage(), exception);
        return responseSupport.failed(HttpStatus.BAD_REQUEST, null, buildValidationErrors(exception.getConstraintViolations()));
    }

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<ResponseData> handleMultipartException(MultipartException exception) {
        logErr.error(exception.getMessage(), exception);
        return responseSupport.failed(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(CompletionException.class)
    public ResponseEntity<ResponseData> handleCompletionException(CompletionException exception) {
        logErr.error(exception.getMessage(), exception);
        return responseSupport.failed(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    /**
     * Build list of FieldError from set of ConstraintViolation
     *
     * @param violations Set<ConstraintViolation<?>> - Set
     * of parameterized ConstraintViolations
     * @return List<FieldError> - list of validation errors
     */
    private List<FieldError> buildValidationErrors(Set<ConstraintViolation<?>> violations) {
        return violations
                .stream()
                .map(violation ->
                        FieldError
                                .builder()
                                .field(
                                        Objects.requireNonNull(StreamSupport
                                                        .stream(violation.getPropertyPath().spliterator(), false)
                                                        .reduce((first, second) -> second)
                                                        .orElse(null))
                                                .toString()
                                )
                                .message(violation.getMessage())
                                .build()
                )
                .collect(toList());
    }
}

