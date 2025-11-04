package identity.server.backend.web.rest;

import identity.server.backend.framework.handler.model.ResponseData;
import identity.server.backend.framework.support.ResponseSupport;
import identity.server.backend.model.request.user.CreateUserFromAuth0Request;
import identity.server.backend.model.request.user.UpdateUserProfileRequest;
import identity.server.backend.model.response.user.UserResponse;
import identity.server.backend.service.user.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/profile")
public class ProfileController {
    private final IUserService userService;
    private final ResponseSupport responseSupport;

    @GetMapping
    @Operation(
            summary = "Get user profile",
            description = "Get current authenticated user's profile details including roles. Accessible by both USER and ADMIN roles."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User profile retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ResponseData.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request - user account is deleted",
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
            )
    })
    public ResponseEntity<ResponseData> getUserProfile(
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt
    ) {
        String auth0UserId = jwt.getSubject();
        log.info("REST request to get user profile for Auth0 user ID: {}", auth0UserId);

        UserResponse response = userService.getUserProfile(auth0UserId);
        return responseSupport.success(ResponseData.builder()
                .isSuccess(true)
                .message(response.getMessage())
                .data(response)
                .httpStatus(HttpStatus.OK.value())
                .build());
    }

    @PutMapping
    @Operation(
            summary = "Update user profile",
            description = "Update current authenticated user's profile (name and password). Updates both database and Auth0. Accessible by both USER and ADMIN roles."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User profile updated successfully",
                    content = @Content(schema = @Schema(implementation = ResponseData.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Bad request - validation failed, user is deleted, or Auth0 update failed",
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
            )
    })
    public ResponseEntity<ResponseData> updateUserProfile(
            @Parameter(hidden = true) @AuthenticationPrincipal Jwt jwt,
            @Parameter(description = "User profile update request with name and optional password", required = true)
            @Valid @RequestBody UpdateUserProfileRequest request
    ) {
        String auth0UserId = jwt.getSubject();
        log.info("REST request to update user profile for Auth0 user ID: {}", auth0UserId);

        UserResponse response = userService.updateUserProfile(auth0UserId, request);
        return responseSupport.success(ResponseData.builder()
                .isSuccess(true)
                .message(response.getMessage())
                .httpStatus(HttpStatus.OK.value())
                .build());
    }

    @PostMapping("/auth0")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ResponseData> syncUserFromAuth0AndGetRoles(@RequestBody @Valid CreateUserFromAuth0Request request) {
        log.info("REST request to create user from Auth0: {}", request.getSub());
        UserResponse response = userService.syncUserFromAuth0AndGetRoles(request);
        return responseSupport.success(ResponseData.builder()
                .isSuccess(true)
                .message(response.getMessage())
                .data(response)
                .httpStatus(HttpStatus.OK.value())
                .build());
    }
}