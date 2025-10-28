package identity.server.backend.model.response.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import identity.server.backend.domain.User;
import identity.server.backend.model.response.Role.RoleBaseResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Response DTO for user information
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private UUID id;

    private String username;

    private String email;

    @JsonProperty("auth0_user_id")
    private String auth0UserId;

    private String name;

    @JsonProperty("given_name")
    private String givenName;

    @JsonProperty("family_name")
    private String familyName;

    private boolean activated;

    @JsonProperty("url_avatar")
    private String urlAvatar;

    private Set<RoleBaseResponse> roles;

    @JsonProperty("created_by")
    private String createdBy;

    @JsonProperty("created_date")
    private Instant createdDate;

    @JsonProperty("last_modified_by")
    private String lastModifiedBy;

    @JsonProperty("last_modified_date")
    private Instant lastModifiedDate;

    @JsonProperty("is_delete")
    private boolean isDelete;

    private String message;

    public static UserResponse mapToUserResponse(User user, String message) {
        Set<RoleBaseResponse> roleBaseResponses = user.getRoles().stream()
                .map(role -> RoleBaseResponse.builder()
                        .id(role.getId())
                        .code(role.getCode())
                        .build())
                .collect(Collectors.toSet());

        return UserResponse.builder()
                .id(user.getId())
                .message(message)
                .username(user.getUsername())
                .email(user.getEmail())
                .auth0UserId(user.getAuth0UserId())
                .name(user.getName())
                .activated(user.isActivated())
                .urlAvatar(user.getUrlAvatar())
                .roles(roleBaseResponses)
                .createdBy(user.getCreatedBy())
                .createdDate(user.getCreatedDate())
                .lastModifiedBy(user.getLastModifiedBy())
                .lastModifiedDate(user.getLastModifiedDate())
                .isDelete(user.isDelete())
                .build();
    }
}
