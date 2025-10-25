package identity.server.backend.model.request.role;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkDeleteRolesRequest {

    @NotEmpty(message = "IDs list cannot be empty")
    private List<UUID> ids;
}
