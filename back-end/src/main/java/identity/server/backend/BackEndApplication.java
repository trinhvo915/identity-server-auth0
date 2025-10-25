package identity.server.backend;

import identity.server.backend.framework.thirdparty.auth0.model.Auth0UserResponse;
import identity.server.backend.service.sync.UserSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.UUID;

@Log4j2
@SpringBootApplication
@RequiredArgsConstructor
public class BackEndApplication implements CommandLineRunner {

    private final UserSyncService userSyncService;

    public static void main(String[] args) {
        SpringApplication.run(BackEndApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        UUID userId = UUID.fromString("550e8400-e29b-41d4-a716-446655440100");
        String email = "admin@gmail.com";
        String password = "admin@123";
        String name = "admin";

        log.info("Attempting to sync user {} with Auth0...", userId);

        try {
            Auth0UserResponse response = userSyncService.syncDefaultUserWithAuth0(userId, email, password, name);

            if (response != null) {
                log.info("User successfully synced with Auth0: {}", response.getUserId());
            } else {
                log.info("User already exists, skipping sync");
            }

        } catch (Exception e) {
            log.error("Failed to sync user with Auth0: {}", e.getMessage(), e);
            throw e;
        }
    }
}