package identity.server.backend.framework.thirdparty.auth0.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Auth0UserResponse {

    @JsonProperty("user_id")
    private String userId;

    private String email;

    @JsonProperty("email_verified")
    private Boolean emailVerified;

    private String username;

    @JsonProperty("phone_number")
    private String phoneNumber;

    @JsonProperty("phone_verified")
    private Boolean phoneVerified;

    @JsonProperty("created_at")
    private Date createdAt;

    @JsonProperty("updated_at")
    private Date updatedAt;

    private List<Identity> identities;

    @JsonProperty("app_metadata")
    private Map<String, Object> appMetadata;

    @JsonProperty("user_metadata")
    private Map<String, Object> userMetadata;

    private String picture;

    private String name;

    private String nickname;

    @JsonProperty("given_name")
    private String givenName;

    @JsonProperty("family_name")
    private String familyName;

    @JsonProperty("last_ip")
    private String lastIp;

    @JsonProperty("last_login")
    private Date lastLogin;

    @JsonProperty("logins_count")
    private Integer loginsCount;

    private Boolean blocked;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Identity {
        private String connection;

        @JsonProperty("user_id")
        private String userId;

        private String provider;

        @JsonProperty("isSocial")
        private Boolean isSocial;
    }
}
