package identity.server.backend.framework.thirdparty.auth0.service.user;

import identity.server.backend.framework.thirdparty.auth0.model.Auth0UserResponse;
import identity.server.backend.framework.thirdparty.auth0.model.CreateUserRequest;

public interface IAuth0UserService {
    Auth0UserResponse createUser(CreateUserRequest request) throws RuntimeException;

    Object updateUser() throws RuntimeException;

    Object deleteUser() throws RuntimeException;
}
