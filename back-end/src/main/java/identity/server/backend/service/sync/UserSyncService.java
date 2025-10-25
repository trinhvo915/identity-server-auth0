package identity.server.backend.service.sync;

import identity.server.backend.domain.User;
import identity.server.backend.framework.thirdparty.auth0.model.Auth0UserResponse;
import identity.server.backend.framework.thirdparty.auth0.model.CreateUserRequest;
import identity.server.backend.framework.thirdparty.auth0.service.user.IAuth0UserService;
import identity.server.backend.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Log4j2
@RequiredArgsConstructor
public class UserSyncService {
    private final IUserService userService;
    private final IAuth0UserService auth0UserService;

    /**
     * Synchronizes a user with Auth0 in a thread-safe and instance-safe manner
     * Uses database pessimistic locking to prevent race conditions
     * @param userId   The user ID to sync
     * @param email    User email
     * @param password User password
     * @param name     User full name
     * @return The synchronized Auth0UserResponse, or null if user already synced
     */
    @Transactional(isolation = Isolation.SERIALIZABLE, timeout = 30)
    public Auth0UserResponse syncDefaultUserWithAuth0(UUID userId, String email, String password, String name) {
        try {
            log.debug("Starting user sync for userId: {}", userId);

            User existingUser = userService.findByIdWithLock(userId);

            if (existingUser == null) {
                log.warn("Cannot sync user with Auth0 - User not found with userId: {}", userId);
                return null;
            }

            if (existingUser.getAuth0UserId() != null) {
                log.info("User already synced with Auth0 - auth0UserId: {}",existingUser.getAuth0UserId());
                return null;
            }

            CreateUserRequest request = buildCreateUserRequest(email, password, name);
            Auth0UserResponse auth0Response = auth0UserService.createUser(request);

            log.info("User created in Auth0. Auth0UserId: {}", auth0Response.getUserId());

             userService.updateAuth0UserId(existingUser, auth0Response.getUserId(), auth0Response.getPicture());

            log.info("Successfully synced user {} with Auth0. Auth0UserId: {}",
                userId, auth0Response.getUserId());

            return auth0Response;

        } catch (Exception e) {
            log.error("Failed to sync user {} with Auth0: {}", userId, e.getMessage(), e);
            throw new RuntimeException("User sync failed: " + e.getMessage(), e);
        }
    }

    private CreateUserRequest buildCreateUserRequest(String email, String password, String name) {
        return CreateUserRequest.builder()
                .email(email)
                .password(password)
                .name(name)
                .connection("Username-Password-Authentication")
                .emailVerified(true)
                .verifyEmail(true)
                .blocked(false)
                .build();
    }
}
