package identity.server.backend.model.request.role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRoleRequest {

    @NotBlank(message = "Role code is required")
    @Size(min = 2, max = 64, message = "Role code must be between 2 and 64 characters")
    private String code;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
}
