package identity.server.backend.service.user;

import identity.server.backend.domain.User;
import identity.server.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public User findByIdWithLock(UUID userId) {
        log.debug("Finding user by ID with lock: {}", userId);
        return userRepository.findByIdWithLock(userId).orElse(null);
    }

    @Override
    @Transactional
    public void updateAuth0UserId(User user, String auth0UserId, String urlAvatar) {
        log.debug("Updating Auth0 user ID for user: {}", user.getId());

        user.setUrlAvatar(urlAvatar);
        user.setAuth0UserId(auth0UserId);
        user.setLastModifiedBy("AUTH0_SYNC");
        user.setLastModifiedDate(Instant.now());

        userRepository.save(user);
        log.info("Updated Auth0 user ID for user: {}. Auth0UserId: {}", user.getId(), auth0UserId);
    }
}
