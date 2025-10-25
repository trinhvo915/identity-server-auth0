package identity.server.backend.config;

import identity.server.backend.domain.Role;
import identity.server.backend.domain.User;
import identity.server.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final UserRepository userRepository;

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        String auth0UserId = jwt.getSubject();

        log.debug("Converting JWT for Auth0 user ID: {}", auth0UserId);

        Collection<GrantedAuthority> authorities = extractAuthorities(auth0UserId);

        log.debug("Loaded {} authorities for user {}: {}",
                authorities.size(), auth0UserId, authorities);

        return new JwtAuthenticationToken(jwt, authorities);
    }

    /**
     * Extract authorities (roles) from database for the given Auth0 user ID
     *
     * @param auth0UserId Auth0 user ID from JWT sub claim
     * @return Collection of granted authorities
     */
    private Collection<GrantedAuthority> extractAuthorities(String auth0UserId) {
        try {
            return userRepository.findByAuth0UserIdWithRoles(auth0UserId)
                    .map(User::getRoles)
                    .map(this::mapRolesToAuthorities)
                    .orElseGet(() -> {
                        log.warn("No user found with Auth0 ID: {}. Granting no authorities.", auth0UserId);
                        return Collections.emptySet();
                    });
        } catch (Exception e) {
            log.error("Error loading authorities for Auth0 user ID: {}", auth0UserId, e);
            return Collections.emptySet();
        }
    }

    private Set<GrantedAuthority> mapRolesToAuthorities(Set<Role> roles) {
        return roles.stream()
                .filter(role -> !role.isDelete())
                .map(role -> new SimpleGrantedAuthority(role.getCode()))
                .collect(Collectors.toSet());
    }
}
