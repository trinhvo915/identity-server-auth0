package identity.server.backend.service.role;

import identity.server.backend.domain.Role;
import identity.server.backend.model.request.role.RoleFilter;
import identity.server.backend.repository.RoleRepository;
import identity.server.backend.model.request.role.CreateRoleRequest;
import identity.server.backend.model.response.role.RoleResponse;
import identity.server.backend.model.request.role.UpdateRoleRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoleServiceImpl implements IRoleService {

    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public RoleResponse createRole(CreateRoleRequest request) {
        log.info("Creating new role with code: {}", request.getCode());

        String upperCaseCode = request.getCode().trim().toUpperCase();

        if (roleRepository.existsByCodeIgnoreCase(upperCaseCode)) {
            throw new IllegalArgumentException("Role with code '" + upperCaseCode + "' already exists");
        }

        Role role = Role.builder()
                .id(UUID.randomUUID())
                .code(upperCaseCode)
                .description(request.getDescription())
                .build();

        Role savedRole = roleRepository.save(role);
        log.info("Role created successfully with ID: {}", savedRole.getId());

        return RoleResponse.mapToResponse(savedRole);
    }

    @Override
    @Transactional
    public RoleResponse updateRoleDescription(UUID id, UpdateRoleRequest request) {
        log.info("Updating description for role ID: {}", id);

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Role not found with ID: " + id));

        if (role.isDelete()) {
            throw new IllegalArgumentException("Cannot update deleted role");
        }

        role.setDescription(request.getDescription());
        role.setLastModifiedBy("SYSTEM"); // TODO: Get from SecurityContext
        role.setLastModifiedDate(Instant.now());

        Role updatedRole = roleRepository.save(role);
        log.info("Role description updated successfully for ID: {}", id);

        return RoleResponse.mapToResponse(updatedRole);
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse getRoleById(UUID id) {
        log.debug("Getting role by ID: {}", id);

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Role not found with ID: " + id));

        if (role.isDelete()) {
            throw new IllegalArgumentException("Role has been deleted");
        }

        return RoleResponse.mapToResponse(role);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RoleResponse> searchRoles(RoleFilter roleFilter) {
        log.debug("Searching roles with filter: search='{}', page={}, size={}, sortBy={}, orderBy={}",
                roleFilter.getSearchTerm(),
                roleFilter.getPage(),
                roleFilter.getSize(),
                roleFilter.getSortByRole(),
                roleFilter.getOrderBy());

        String sortField = roleFilter.getSortByRole() != null
                ? roleFilter.getSortByRole().getField()
                : "code";

        Sort.Direction direction = roleFilter.getOrderBy() != null
                ? roleFilter.getOrderBy()
                : Sort.Direction.ASC;

        Sort sort = Sort.by(direction, sortField);

        int page = roleFilter.getPage() != null ? roleFilter.getPage() : 0;
        int size = roleFilter.getSize() != null ? roleFilter.getSize() : 20;
        Pageable pageable = PageRequest.of(page, size, sort);

        String searchTerm = roleFilter.getSearchTerm();
        Page<Role> roles = roleRepository.searchRoles(searchTerm.trim(), pageable);

        return roles.map(RoleResponse::mapToResponse);
    }

    @Override
    @Transactional
    public void deleteRole(UUID id) {
        log.info("Soft deleting role with ID: {}", id);

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Role not found with ID: " + id));

        if (role.isDelete()) {
            throw new IllegalArgumentException("Role is already deleted");
        }

        role.setDelete(true);
        role.setLastModifiedBy("SYSTEM"); // TODO: Get from SecurityContext
        role.setLastModifiedDate(Instant.now());

        roleRepository.save(role);
        log.info("Role soft deleted successfully: {}", id);

        RoleResponse.mapToResponse(role);
    }
}
