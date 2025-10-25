package identity.server.backend.framework.thirdparty.auth0.model;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Data
public class Auth0M2MConfig {
    @Value("${auth0.m2m.domain}")
    private String auth0Domain;

    @Value("${auth0.m2m.clientid}")
    private String clientId;

    @Value("${auth0.m2m.client.secret}")
    private String clientSecret;

    @Value("${auth0.m2m.audience}")
    private String audience;
}
