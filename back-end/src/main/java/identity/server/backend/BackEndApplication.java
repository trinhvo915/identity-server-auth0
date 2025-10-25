package identity.server.backend;

import identity.server.backend.framework.thirdparty.auth0.model.Auth0UserResponse;
import identity.server.backend.service.sync.UserSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.UUID;

@Log4j2
@SpringBootApplication
@RequiredArgsConstructor
public class BackEndApplication implements CommandLineRunner {

    private final UserSyncService userSyncService;

    @Value("${user.admin.name}")
    private String adminName;

    @Value("${user.admin.email}")
    private String adminEmail;

    @Value("${user.admin.password}")
    private String adminPassword;

    public static void main(String[] args) {
        SpringApplication.run(BackEndApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        UUID userId = UUID.fromString("550e8400-e29b-41d4-a716-446655440100");
        log.info("Attempting to sync admin user {} with Auth0...", userId);
        log.info("Admin credentials - Name: {}, Email: {}", adminName, adminEmail);

        try {
            Auth0UserResponse response = userSyncService.syncDefaultUserWithAuth0(
                userId,
                adminEmail,
                adminPassword,
                adminName
            );

            if (response != null) {
                log.info("Admin user successfully synced with Auth0: {}", response.getUserId());
            } else {
                log.info("Admin user already exists, skipping sync");
            }

        } catch (Exception e) {
            log.error("Failed to sync admin user with Auth0: {}", e.getMessage(), e);
            throw e;
        }
    }
}