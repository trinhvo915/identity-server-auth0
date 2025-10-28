package identity.server.backend.framework.thirdparty.auth0.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserAuth0Request {

    private String email;

    @JsonProperty("phone_number")
    private String phoneNumber;

    @JsonProperty("user_metadata")
    private Object userMetadata;

    private Boolean blocked;

    @JsonProperty("email_verified")
    private Boolean emailVerified;

    @JsonProperty("phone_verified")
    private Boolean phoneVerified;

    @JsonProperty("app_metadata")
    private Object appMetadata;

    @JsonProperty("given_name")
    private String givenName;

    @JsonProperty("family_name")
    private String familyName;

    private String name;

    private String nickname;

    private String picture;

    @JsonProperty("user_id")
    private String userId;

    private String connection;

    private String password;

    @JsonProperty("verify_email")
    private Boolean verifyEmail;
}
