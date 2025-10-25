package identity.server.backend.framework.support;

import java.util.List;
import java.util.Objects;

import identity.server.backend.framework.handler.model.FieldError;
import identity.server.backend.framework.handler.model.ResponseData;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class ResponseSupport {

    public ResponseEntity<ResponseData> success() {
        return response(HttpStatus.OK,null, new ResponseData(), null);
    }

    public ResponseEntity<ResponseData> success(String message) {
        return response(HttpStatus.OK, message, new ResponseData(), null);
    }

    public ResponseEntity<ResponseData> success(ResponseData data) {
        return response(HttpStatus.OK, null, data, null);
    }

    public ResponseEntity<ResponseData> success(String message, ResponseData data) {
        return response(HttpStatus.OK, message, data, null);
    }

    public ResponseEntity<ResponseData> failed() {
        return response(HttpStatus.BAD_REQUEST, null, new ResponseData(), null);
    }

    public ResponseEntity<ResponseData> failed(String message) {
        return response(HttpStatus.BAD_REQUEST, message, new ResponseData(), null);
    }

    public ResponseEntity<ResponseData> failed(HttpStatus httpStatus, String message) {
        return response(httpStatus, message, new ResponseData(), null);
    }

    public ResponseEntity<ResponseData> failed(HttpStatus httpStatus, String message, List<FieldError> filedErrs) {
        return response(httpStatus, message, new ResponseData(), filedErrs);
    }

    private ResponseEntity<ResponseData> response(HttpStatus httpStatus, String message, ResponseData data, List<FieldError> fieldErrors) {
        if (data == null) {
            data = new ResponseData();
        }
        if (Objects.isNull(data.getIsSuccess())) {
            data.setIsSuccess(HttpStatus.OK.equals(httpStatus));
        }
        if (!HttpStatus.OK.equals(httpStatus)) {
            if (CollectionUtils.isNotEmpty(fieldErrors)) {
                data.setFieldErrors(fieldErrors);
            }
            data.setData(null);
        }
        if (Objects.nonNull(message)) {
            data.setMessage(message);
        }
        return ResponseEntity.status(httpStatus).body(data);
    }
}
