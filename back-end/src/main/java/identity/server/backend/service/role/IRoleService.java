package identity.server.backend.service.role;

import identity.server.backend.model.request.role.CreateRoleRequest;
import identity.server.backend.model.request.role.RoleFilter;
import identity.server.backend.model.response.role.RoleResponse;
import identity.server.backend.model.request.role.UpdateRoleRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IRoleService {

    RoleResponse createRole(CreateRoleRequest request);

    RoleResponse updateRoleDescription(UUID id, UpdateRoleRequest request);

    RoleResponse getRoleById(UUID id);

    Page<RoleResponse> searchRoles(RoleFilter roleFilter);

    void deleteRole(UUID id);
}
