package identity.server.backend.service.user;

import identity.server.backend.domain.User;

import java.util.UUID;

public interface IUserService {
    User findByIdWithLock(UUID userId);

    void updateAuth0UserId(User user, String auth0UserId, String urlAvatar);
}
