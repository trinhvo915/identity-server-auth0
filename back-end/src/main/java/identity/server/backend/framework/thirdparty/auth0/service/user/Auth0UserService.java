package identity.server.backend.framework.thirdparty.auth0.service.user;

import identity.server.backend.framework.thirdparty.auth0.model.Auth0M2MConfig;
import identity.server.backend.framework.thirdparty.auth0.model.Auth0UserResponse;
import identity.server.backend.framework.thirdparty.auth0.model.CreateUserRequest;
import identity.server.backend.framework.thirdparty.auth0.model.UpdateUserRequest;
import identity.server.backend.framework.thirdparty.auth0.service.base.IBaseAuth0;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@Log4j2
@RequiredArgsConstructor
public class Auth0UserService implements IAuth0UserService {
    private final IBaseAuth0 baseAuth0;
    private final Auth0M2MConfig auth0Config;

    @Override
    public Auth0UserResponse createUser(CreateUserRequest request) {
        log.info("Creating user with email: {}", request.getEmail());
        String accessToken = baseAuth0.getAccessToken(auth0Config);

        Auth0UserResponse response = baseAuth0.executePost(
                auth0Config.getAuth0Domain() + "api/v2/users",
                request,
                Auth0UserResponse.class,
                null,
                "Authorization", "Bearer " + accessToken,
                "Content-Type", "application/json"
        );

        log.info("User created successfully: {}", response.getUserId());
        return response;
    }

    @Override
    public void updateUser(String auth0UserId, UpdateUserRequest request) {
        log.info("Updating user: {}", auth0UserId);
        String accessToken = baseAuth0.getAccessToken(auth0Config);

        Auth0UserResponse response = baseAuth0.executePatch(
                auth0Config.getAuth0Domain() + "api/v2/users/" + auth0UserId,
                request,
                Auth0UserResponse.class,
                null,
                "Authorization", "Bearer " + accessToken,
                "Content-Type", "application/json"
        );

        log.info("User updated successfully: {}", response.getUserId());
    }

    @Override
    public Auth0UserResponse getUserFilterEmail(String email) throws RuntimeException {
        log.info("Getting user by email: {}", email);
        String accessToken = baseAuth0.getAccessToken(auth0Config);

        String query = String.format("email:\"%s\"", email);
        String url = UriComponentsBuilder.fromUriString(auth0Config.getAuth0Domain() + "api/v2/users")
                .queryParam("q", query)
                .queryParam("search_engine", "v3")
                .build()
                .toUriString();

        Auth0UserResponse[] users = baseAuth0.executeGet(
                url,
                Auth0UserResponse[].class,
                null,
                "Authorization", "Bearer " + accessToken
        );

        if (users == null || users.length == 0) {
            log.warn("User not found with email: {}", email);
            return null;
        }

        log.info("User found with email: {}", email);
        return users[0];
    }

    @Override
    public Auth0UserResponse getUserFilterAuth0Id(String auth0Id) throws RuntimeException {
        log.info("Getting user by Auth0 ID: {}", auth0Id);
        String accessToken = baseAuth0.getAccessToken(auth0Config);

        try {
            Auth0UserResponse response = baseAuth0.executeGet(
                    auth0Config.getAuth0Domain() + "api/v2/users/" + auth0Id,
                    Auth0UserResponse.class,
                    null,
                    "Authorization", "Bearer " + accessToken
            );

            log.info("User found with Auth0 ID: {}", auth0Id);
            return response;
        } catch (Exception e) {
            log.warn("User not found with Auth0 ID: {}", auth0Id);
            return null;
        }
    }

    @Override
    public Boolean deleteUser(String auth0Id) {
        log.info("Deleting user: {}", auth0Id);
        String accessToken = baseAuth0.getAccessToken(auth0Config);

        try {
            baseAuth0.executeDelete(
                    auth0Config.getAuth0Domain() + "api/v2/users/" + auth0Id,
                    Void.class,
                    null,
                    "Authorization", "Bearer " + accessToken
            );

            log.info("User deleted successfully: {}", auth0Id);
            return true;
        } catch (Exception e) {
            log.error("Failed to delete user: {}", auth0Id, e);
            return false;
        }
    }

    @Override
    public void blockUser(String auth0Id, Boolean blocked) throws RuntimeException {
        log.info("{} user: {}", blocked ? "Blocking" : "Unblocking", auth0Id);
        String accessToken = baseAuth0.getAccessToken(auth0Config);

        try {
            UpdateUserRequest request = UpdateUserRequest.builder()
                    .blocked(blocked)
                    .build();

            Auth0UserResponse response = baseAuth0.executePatch(
                    auth0Config.getAuth0Domain() + "api/v2/users/" + auth0Id,
                    request,
                    Auth0UserResponse.class,
                    null,
                    "Authorization", "Bearer " + accessToken,
                    "Content-Type", "application/json"
            );

            log.info("User {} successfully: {}", blocked ? "blocked" : "unblocked", auth0Id);
        } catch (Exception e) {
            log.error("Failed to {} user: {}", blocked ? "block" : "unblock", auth0Id, e);
        }
    }
}
