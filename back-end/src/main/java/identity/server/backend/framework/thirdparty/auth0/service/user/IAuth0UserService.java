package identity.server.backend.framework.thirdparty.auth0.service.user;

import identity.server.backend.framework.thirdparty.auth0.model.Auth0UserResponse;
import identity.server.backend.framework.thirdparty.auth0.model.CreateUserAuth0Request;
import identity.server.backend.framework.thirdparty.auth0.model.UpdateUserRequest;

public interface IAuth0UserService {
    Auth0UserResponse createUser(CreateUserAuth0Request request) throws RuntimeException;

    void updateUser(String auth0UserId, UpdateUserRequest request) throws RuntimeException;

    Auth0UserResponse getUserFilterEmail(String email) throws RuntimeException;

    Auth0UserResponse getUserFilterAuth0Id(String auth0Id) throws RuntimeException;

    Boolean deleteUser(String auth0Id) throws RuntimeException;

    void blockUser(String auth0Id, Boolean blocked) throws RuntimeException;
}
