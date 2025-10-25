package identity.server.backend.config;

import lombok.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Optional;

@Configuration
@EnableJpaAuditing
public class AuditingConfiguration {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return new SpringSecurityAuditAwareImpl();
    }

    /**
     * Implementation of AuditorAware that extracts the current user
     * from Spring Security context.
     *
     * Returns:
     * - Auth0 user ID (sub claim) if authenticated via JWT
     * - "SYSTEM" if not authenticated or anonymous
     */
    static class SpringSecurityAuditAwareImpl implements AuditorAware<String> {

        private static final String SYSTEM = "SYSTEM";

        @Override
        @NonNull
        public Optional<String> getCurrentAuditor() {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            // Return SYSTEM if no authentication or anonymous
            if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication instanceof AnonymousAuthenticationToken) {
                return Optional.of(SYSTEM);
            }

            try {
                String userId = extractUserIdFromPrincipal(authentication.getPrincipal());
                return Optional.of(userId);
            } catch (Exception e) {
                // Fallback to SYSTEM if extraction fails
                return Optional.of(SYSTEM);
            }
        }

        /**
         * Extract user ID from authentication principal.
         * For JWT tokens, returns the 'sub' claim (Auth0 user ID).
         *
         * @param principal Authentication principal
         * @return User ID string
         * @throws IllegalArgumentException if principal type is unsupported
         */
        private String extractUserIdFromPrincipal(Object principal) {
            if (principal instanceof Jwt jwt) {
                // Extract 'sub' claim from JWT (Auth0 user ID)
                Object subClaim = jwt.getClaims().get("sub");
                if (subClaim != null) {
                    return subClaim.toString();
                }
                throw new IllegalArgumentException("JWT token missing 'sub' claim");
            } else {
                throw new IllegalArgumentException("Unsupported principal type: " + principal.getClass());
            }
        }
    }
}
