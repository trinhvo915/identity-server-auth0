package identity.server.backend.model.response.Role;

import identity.server.backend.domain.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.Instant;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RoleResponse extends RoleBaseResponse {
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
