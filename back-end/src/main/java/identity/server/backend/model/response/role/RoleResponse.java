package identity.server.backend.model.response.role;

import identity.server.backend.domain.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleResponse {
    private UUID id;
    private String code;
    private String description;
    private String createdBy;
    private Instant createdDate;
    private String lastModifiedBy;
    private Instant lastModifiedDate;
    private Boolean isDelete;

    public static RoleResponse mapToResponse(Role role) {
        return RoleResponse.builder()
                .id(role.getId())
                .code(role.getCode())
                .description(role.getDescription())
                .createdBy(role.getCreatedBy())
                .createdDate(role.getCreatedDate())
                .lastModifiedBy(role.getLastModifiedBy())
                .lastModifiedDate(role.getLastModifiedDate())
                .isDelete(role.isDelete())
                .build();
    }
}
