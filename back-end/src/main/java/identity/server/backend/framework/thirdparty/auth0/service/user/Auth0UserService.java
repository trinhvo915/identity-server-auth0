package identity.server.backend.framework.thirdparty.auth0.service.user;

import identity.server.backend.framework.thirdparty.auth0.model.Auth0M2MConfig;
import identity.server.backend.framework.thirdparty.auth0.model.Auth0UserResponse;
import identity.server.backend.framework.thirdparty.auth0.model.CreateUserRequest;
import identity.server.backend.framework.thirdparty.auth0.service.base.IBaseAuth0;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@RequiredArgsConstructor
public class Auth0UserService implements IAuth0UserService {
    private final IBaseAuth0 baseAuth0;
    private final Auth0M2MConfig auth0Config;

    @Override
    public Auth0UserResponse createUser(CreateUserRequest request) {
        String accessToken = baseAuth0.getAccessToken(auth0Config);

        Auth0UserResponse response = baseAuth0.executePost(
                auth0Config.getAuth0Domain() + "/api/v2/users",
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
    public Object updateUser() {
        log.warn("updateUser is not yet implemented");
        throw new UnsupportedOperationException("User update is not yet implemented");
    }

    @Override
    public Object deleteUser() {
        log.warn("deleteUser is not yet implemented");
        throw new UnsupportedOperationException("User deletion is not yet implemented");
    }
}
