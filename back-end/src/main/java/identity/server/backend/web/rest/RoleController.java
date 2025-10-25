package identity.server.backend.web.rest;

import identity.server.backend.framework.constants.MessageConstants;
import identity.server.backend.framework.handler.model.ResponseData;
import identity.server.backend.framework.support.ResponseSupport;
import identity.server.backend.model.request.role.RoleFilter;
import identity.server.backend.model.request.role.SortByRole;
import identity.server.backend.service.role.IRoleService;
import identity.server.backend.model.request.role.CreateRoleRequest;
import identity.server.backend.model.response.role.RoleResponse;
import identity.server.backend.model.request.role.UpdateRoleRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@Slf4j
public class RoleController {
    private final ResponseSupport responseSupport;
    private final IRoleService roleService;

    @PostMapping
    @Operation(summary = "Create new role", description = "Create a new role with code (auto uppercase) and description")
    public ResponseEntity<ResponseData> createRole(@Valid @RequestBody CreateRoleRequest request) {
        log.info("REST request to create role: {}", request.getCode());
        RoleResponse response = roleService.createRole(request);

        return responseSupport.success(ResponseData.builder()
                .isSuccess(true)
                .httpStatus(HttpStatus.CREATED.value())
                .data(response)
                .message(MessageConstants.CREATE_ROLE_SUCCESS)
                .build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update role description", description = "Update description of an existing role")
    public ResponseEntity<ResponseData> updateRoleDescription(
            @Parameter(description = "Role ID") @PathVariable UUID id,
            @Valid @RequestBody UpdateRoleRequest request) {
        log.info("REST request to update role description: {}", id);
        RoleResponse response = roleService.updateRoleDescription(id, request);
        return responseSupport.success(ResponseData.builder()
                .isSuccess(true)
                .httpStatus(HttpStatus.OK.value())
                .data(response)
                .message(MessageConstants.UPDATE_ROLE_SUCCESS)
                .build());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get role by ID", description = "Retrieve role details by ID")
    public ResponseEntity<ResponseData> getRoleById(
            @Parameter(description = "Role ID") @PathVariable UUID id) {
        log.debug("REST request to get role: {}", id);
        RoleResponse response = roleService.getRoleById(id);
        return responseSupport.success(ResponseData.builder()
                .isSuccess(true)
                .httpStatus(HttpStatus.OK.value())
                .data(response)
                .build());
    }

    @GetMapping
    @Operation(
        summary = "Search roles",
        description = "Search roles by code or description with pagination. Default size is 20, sorted by code ascending."
    )
    public ResponseEntity<ResponseData> searchRoles(
            @Parameter(description = "Search keyword (searches in code and description)")
            @RequestParam(required = false) String search,

            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size,

            @Parameter(description = "Sort field")
            @RequestParam(required = false, defaultValue = "REQUEST_CODE") SortByRole sortBy,

            @Parameter(description = "Sort direction (asc or desc)")
            @RequestParam(required = false, defaultValue = "ASC") Sort.Direction orderBy) {

        log.debug("REST request to search roles: search='{}', page={}, size={}, sort={}",
                search, page, size, sortBy);

        RoleFilter roleFilter = RoleFilter.builder()
                .page(page)
                .size(size)
                .sortByRole(sortBy)
                .orderBy(orderBy)
                .searchTerm(search)
                .build();
        Page<RoleResponse> roles = roleService.searchRoles(roleFilter);
        return responseSupport.success(ResponseData.builder()
                .isSuccess(true)
                .httpStatus(HttpStatus.OK.value())
                .data(roles)
                .build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete role", description = "Soft delete a role (sets isDelete flag to true)")
    public ResponseEntity<ResponseData> deleteRole(
            @Parameter(description = "Role ID") @PathVariable UUID id) {
        log.info("REST request to delete role: {}", id);
        roleService.deleteRole(id);
        return responseSupport.success(ResponseData.builder()
                .isSuccess(true)
                .httpStatus(HttpStatus.OK.value())
                .message(MessageConstants.DELETE_ROLE_SUCCESS)
                .build());
    }
}
