package identity.server.backend.service.role;

import identity.server.backend.domain.Role;
import identity.server.backend.model.request.role.RoleFilter;
import identity.server.backend.repository.RoleRepository;
import identity.server.backend.model.request.role.CreateRoleRequest;
import identity.server.backend.model.response.Role.RoleResponse;
import identity.server.backend.model.request.role.UpdateRoleRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
        // lastModifiedBy and lastModifiedDate are automatically set by JPA Auditing

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
        log.debug("Searching roles with filter: search='{}', status={}, createdDateFrom={}, createdDateTo={}, page={}, size={}, sortBy={}, orderBy={}",
                roleFilter.getSearchTerm(),
                roleFilter.getStatus(),
                roleFilter.getCreatedDateFrom(),
                roleFilter.getCreatedDateTo(),
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
        String normalizedSearch = (searchTerm != null && !searchTerm.isBlank())
            ? searchTerm.trim()
            : null;

        Boolean isDelete = roleFilter.getStatus();

        Page<Role> roles = roleRepository.searchRoles(
                normalizedSearch,
                isDelete,
                roleFilter.getCreatedDateFrom(),
                roleFilter.getCreatedDateTo(),
                pageable
        );

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
        // lastModifiedBy and lastModifiedDate are automatically set by JPA Auditing

        roleRepository.save(role);
        log.info("Role soft deleted successfully: {}", id);

        RoleResponse.mapToResponse(role);
    }

    @Override
    @Transactional
    public int bulkDeleteRoles(List<UUID> ids) {
        log.info("Bulk deleting {} roles", ids.size());

        // Fetch all roles by IDs
        List<Role> roles = roleRepository.findAllById(ids);

        // Filter out system roles (USER and ADMIN) and already deleted roles
        List<Role> rolesToDelete = roles.stream()
                .filter(role -> !role.getCode().equals("USER") && !role.getCode().equals("ADMIN"))
                .filter(role -> !role.isDelete())
                .toList();

        // Soft delete the filtered roles
        rolesToDelete.forEach(role -> role.setDelete(true));
        roleRepository.saveAll(rolesToDelete);

        int deletedCount = rolesToDelete.size();
        log.info("Successfully soft deleted {} role(s). {} role(s) were skipped (system roles or already deleted).",
                deletedCount, ids.size() - deletedCount);

        return deletedCount;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> getAllActiveRoles() {
        log.debug("Getting all active roles");

        List<Role> activeRoles = roleRepository.findAllActiveRoles();

        log.info("Found {} active role(s)", activeRoles.size());

        return activeRoles.stream()
                .map(RoleResponse::mapToResponse)
                .toList();
    }
}
