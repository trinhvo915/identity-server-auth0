package identity.server.backend.framework.handler.model;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseData {
    private Boolean isSuccess;
    private Integer httpStatus;
    private String message;

    @JsonProperty("validationErrors")
    private List<FieldError> fieldErrors;

    private Object data;
}

