package identity.server.backend.framework.thirdparty.auth0.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UpdateUserRequest {
    private String email;

    @JsonProperty("email_verified")
    private Boolean emailVerified;

    @JsonProperty("phone_number")
    private String phoneNumber;

    @JsonProperty("phone_verified")
    private Boolean phoneVerified;

    private String name;

    private String nickname;

    @JsonProperty("given_name")
    private String givenName;

    @JsonProperty("family_name")
    private String familyName;

    private String picture;

    @JsonProperty("user_metadata")
    private Map<String, Object> userMetadata;

    @JsonProperty("app_metadata")
    private Map<String, Object> appMetadata;

    private Boolean blocked;

    private String username;

    private String password;

    @JsonProperty("verify_password")
    private Boolean verifyPassword;
}