package identity.server.backend.service.user;

import identity.server.backend.domain.User;
import identity.server.backend.model.request.user.CreateUserRequest;
import identity.server.backend.model.request.user.UpdateRoleUserRequest;
import identity.server.backend.model.request.user.UpdateUserProfileRequest;
import identity.server.backend.model.request.user.UserFilter;
import identity.server.backend.model.response.user.UserResponse;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface IUserService {
    User findByIdWithLock(UUID userId);

    void updateAuth0UserId(User user, String auth0UserId, String urlAvatar);

    UserResponse createUser(CreateUserRequest request);

    UserResponse updateRoleUser(UUID userId, UpdateRoleUserRequest request);

    UserResponse deleteUser(UUID userId);

    UserResponse getUserProfile(String auth0UserId);

    Page<UserResponse> searchUsers(UserFilter userFilter);

    UserResponse getUserDetail(UUID userId);

    UserResponse updateUserProfile(String auth0UserId, UpdateUserProfileRequest request);
}
