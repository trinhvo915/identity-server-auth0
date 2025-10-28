package identity.server.backend.web.rest;

import identity.server.backend.framework.handler.model.ResponseData;
import identity.server.backend.framework.support.ResponseSupport;
import identity.server.backend.model.request.user.CreateUserRequest;
import identity.server.backend.model.request.user.SortByUser;
import identity.server.backend.model.request.user.UpdateRoleUserRequest;
import identity.server.backend.model.request.user.UserFilter;
import identity.server.backend.model.response.user.UserResponse;
import identity.server.backend.service.user.IUserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User Management", description = "APIs for user management")
public class UserController {
    private final IUserService userService;
    private final ResponseSupport responseSupport;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(
        summary = "Create a new user",
        description = "Create a new user or reactivate a deleted user. " +
                "Business logic: " +
                "1. If email doesn't exist: creates new user in database and Auth0, then syncs Auth0 ID and avatar. " +
                "2. If email exists and is deleted: reactivates user in database and Auth0. " +
                "3. If email exists and is active: returns error message 'Email already exists.'"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User created or reactivated successfully",
            content = @Content(schema = @Schema(implementation = ResponseData.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - validation failed or email already exists",
            content = @Content(schema = @Schema(implementation = ResponseData.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - authentication required"
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden - requires ADMIN authority"
        )
    })
    public ResponseEntity<ResponseData> createUser(
            @Parameter(description = "User creation request with validation", required = true)
            @Valid @RequestBody CreateUserRequest request
    ) {
        log.info("REST request to create user: {}", request.getEmail());
        UserResponse response = userService.createUser(request);
        return responseSupport.success(ResponseData.builder()
                .isSuccess(true)
                .message(response.getMessage())
                .httpStatus(HttpStatus.OK.value())
                .build());
    }

    @PutMapping("/role/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(
        summary = "Update user name and roles",
        description = "Update user name (synced to Auth0) and roles (database only) for a specific user"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User updated successfully",
            content = @Content(schema = @Schema(implementation = ResponseData.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - validation failed or user is deleted",
            content = @Content(schema = @Schema(implementation = ResponseData.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "User not found",
            content = @Content(schema = @Schema(implementation = ResponseData.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - authentication required"
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden - requires ADMIN authority"
        )
    })
    public ResponseEntity<ResponseData> updateRoleUser(
            @Parameter(description = "User ID", required = true)
            @PathVariable UUID userId,
            @Parameter(description = "User update request with name and role IDs", required = true)
            @Valid @RequestBody UpdateRoleUserRequest request
    ) {
        log.info("REST request to update user: {}", userId);
        UserResponse response = userService.updateRoleUser(userId, request);
        return responseSupport.success(ResponseData.builder()
                .isSuccess(true)
                .message(response.getMessage())
                .httpStatus(HttpStatus.OK.value())
                .build());
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(
        summary = "Delete user (soft delete)",
        description = "Soft delete user in database (sets isDelete=true, activated=false) and blocks user in Auth0 (sets blocked=true)"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User deleted successfully",
            content = @Content(schema = @Schema(implementation = ResponseData.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - user is already deleted",
            content = @Content(schema = @Schema(implementation = ResponseData.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "User not found",
            content = @Content(schema = @Schema(implementation = ResponseData.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - authentication required"
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden - requires ADMIN authority"
        )
    })
    public ResponseEntity<ResponseData> deleteUser(
            @Parameter(description = "User ID", required = true)
            @PathVariable UUID userId
    ) {
        log.info("REST request to delete user: {}", userId);
        UserResponse response = userService.deleteUser(userId);
        return responseSupport.success(ResponseData.builder()
                .isSuccess(true)
                .message(response.getMessage())
                .httpStatus(HttpStatus.OK.value())
                .build());
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(
        summary = "Search users",
        description = "Search users by email or username with pagination. Default size is 20, sorted by email ascending. " +
                "Dates should be sent in ISO-8601 format (e.g., 2024-01-01T00:00:00Z). " +
                "The backend will automatically handle timezone conversion to UTC for database queries."
    )
    public ResponseEntity<ResponseData> searchUsers(
            @Parameter(description = "Status filter (true = deleted, false = active, null = all)")
            @RequestParam(required = false) Boolean status,

            @Parameter(description = "Search keyword (searches in email and username)")
            @RequestParam(required = false) String search,

            @Parameter(description = "Filter users created from this date (ISO-8601 format, e.g., 2024-01-01T00:00:00Z)")
            @RequestParam(required = false) java.time.Instant createdDateFrom,

            @Parameter(description = "Filter users created until this date (ISO-8601 format, e.g., 2024-12-31T23:59:59Z)")
            @RequestParam(required = false) java.time.Instant createdDateTo,

            @Parameter(description = "Filter by role IDs (users must have at least one of these roles)")
            @RequestParam(required = false) Set<UUID> roleIds,

            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size,

            @Parameter(description = "Sort field (EMAIL, USERNAME, CREATED_DATE)")
            @RequestParam(required = false, defaultValue = "EMAIL") SortByUser sortBy,

            @Parameter(description = "Sort direction (ASC or DESC)")
            @RequestParam(required = false, defaultValue = "ASC") Sort.Direction orderBy) {

        log.debug("REST request to search users: search='{}', status={}, createdDateFrom={}, createdDateTo={}, roleIds={}, page={}, size={}, sortBy={}, orderBy={}",
                search, status, createdDateFrom, createdDateTo, roleIds, page, size, sortBy, orderBy);

        UserFilter userFilter = UserFilter.builder()
                .page(page)
                .size(size)
                .sortByUser(sortBy)
                .orderBy(orderBy)
                .searchTerm(search)
                .status(status)
                .createdDateFrom(createdDateFrom)
                .createdDateTo(createdDateTo)
                .roleIds(roleIds)
                .build();

        Page<UserResponse> users = userService.searchUsers(userFilter);

        return responseSupport.success(ResponseData.builder()
                .isSuccess(true)
                .httpStatus(HttpStatus.OK.value())
                .data(users)
                .build());
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(
        summary = "Get user detail",
        description = "Get user detail by user ID including roles. Used by admin to view user information for updating."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User detail retrieved successfully",
            content = @Content(schema = @Schema(implementation = ResponseData.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "User not found",
            content = @Content(schema = @Schema(implementation = ResponseData.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - authentication required"
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden - requires ADMIN authority"
        )
    })
    public ResponseEntity<ResponseData> getUserDetail(
            @Parameter(description = "User ID", required = true)
            @PathVariable UUID userId
    ) {
        log.info("REST request to get user detail for user ID: {}", userId);

        UserResponse response = userService.getUserDetail(userId);
        return responseSupport.success(ResponseData.builder()
                .isSuccess(true)
                .message(response.getMessage())
                .data(response)
                .httpStatus(HttpStatus.OK.value())
                .build());
    }

    @PutMapping("/{userId}/activate")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(
        summary = "Activate user (reactivate deleted user)",
        description = "Reactivate a soft-deleted user in database (sets isDelete=false, activated=true) and unblocks user in Auth0 (sets blocked=false)"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User activated successfully",
            content = @Content(schema = @Schema(implementation = ResponseData.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - user is already active",
            content = @Content(schema = @Schema(implementation = ResponseData.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "User not found",
            content = @Content(schema = @Schema(implementation = ResponseData.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - authentication required"
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden - requires ADMIN authority"
        )
    })
    public ResponseEntity<ResponseData> activateUser(
            @Parameter(description = "User ID", required = true)
            @PathVariable UUID userId
    ) {
        log.info("REST request to activate user: {}", userId);
        UserResponse response = userService.activateUser(userId);
        return responseSupport.success(ResponseData.builder()
                .isSuccess(true)
                .message(response.getMessage())
                .httpStatus(HttpStatus.OK.value())
                .build());
    }
}
