package identity.server.backend.framework.thirdparty.auth0.service.base;

import identity.server.backend.framework.thirdparty.auth0.model.Auth0M2MConfig;
import identity.server.backend.framework.thirdparty.auth0.model.TokenRequest;
import identity.server.backend.framework.thirdparty.auth0.model.TokenResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.Optional;

@Service
@Log4j2
@RequiredArgsConstructor
public class BaseAuth0Impl implements IBaseAuth0 {

    private static final String OAUTH_TOKEN_ENDPOINT = "oauth/token";
    private static final String GRANT_TYPE_CLIENT_CREDENTIALS = "client_credentials";
    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(10);

    private final WebClient webClient;

    @Override
    public String getAccessToken(Auth0M2MConfig auth0M2MConfig) {
        validateConfig(auth0M2MConfig);

        log.debug("Requesting access token from Auth0 for client: {}", auth0M2MConfig.getClientId());

        TokenRequest request = buildTokenRequest(auth0M2MConfig);
        String tokenUrl = buildTokenUrl(auth0M2MConfig.getAuth0Domain());

        TokenResponse response = executePost(
                tokenUrl,
                request,
                TokenResponse.class,
                REQUEST_TIMEOUT,
                HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE
        );

        return Optional.ofNullable(response)
                .map(TokenResponse::getAccessToken)
                .orElseThrow(() -> new RuntimeException("Received null response from Auth0 token endpoint"));
    }

    private void validateConfig(Auth0M2MConfig config) {
        if (config == null) {
            throw new IllegalArgumentException("Auth0M2MConfig cannot be null");
        }
        if (config.getClientId() == null || config.getClientId().isBlank()) {
            throw new IllegalArgumentException("Client ID cannot be null or blank");
        }
        if (config.getClientSecret() == null || config.getClientSecret().isBlank()) {
            throw new IllegalArgumentException("Client Secret cannot be null or blank");
        }
        if (config.getAuth0Domain() == null || config.getAuth0Domain().isBlank()) {
            throw new IllegalArgumentException("Auth0 Domain cannot be null or blank");
        }
        if (config.getAudience() == null || config.getAudience().isBlank()) {
            throw new IllegalArgumentException("Audience cannot be null or blank");
        }
    }

    private TokenRequest buildTokenRequest(Auth0M2MConfig config) {
        return TokenRequest.builder()
                .clientId(config.getClientId())
                .clientSecret(config.getClientSecret())
                .audience(config.getAudience())
                .grantType(GRANT_TYPE_CLIENT_CREDENTIALS)
                .build();
    }

    private String buildTokenUrl(String domain) {
        return domain.endsWith("/")
                ? domain + OAUTH_TOKEN_ENDPOINT
                : domain + "/" + OAUTH_TOKEN_ENDPOINT;
    }

    /**
     * Generic method to execute HTTP requests with WebClient (supports GET, POST, PUT, DELETE, PATCH)
     * @param httpMethod The HTTP method (GET, POST, PUT, DELETE, PATCH)
     * @param uri The target URI
     * @param requestBody The request body object (can be null for GET/DELETE)
     * @param responseType The expected response class type
     * @param timeout Optional timeout duration (can be null)
     * @param headers Optional headers as key-value pairs (e.g., "Authorization", "Bearer token", "Content-Type", "application/json")
     * @param <T> Response type
     * @param <R> Request type
     * @return The response object
     */
    @Override
    public <T, R> T execute(HttpMethod httpMethod, String uri, R requestBody, Class<T> responseType, Duration timeout, String... headers) {
        try {
            log.debug("Executing {} request to: {}", httpMethod, uri);

            // Create request spec based on HTTP method
            WebClient.RequestHeadersSpec<?> requestSpec;

            if (httpMethod == HttpMethod.GET || httpMethod == HttpMethod.DELETE) {
                // GET and DELETE typically don't have request bodies
                requestSpec = webClient.method(httpMethod).uri(uri);
            } else {
                // POST, PUT, PATCH have request bodies
                WebClient.RequestBodySpec bodySpec = webClient.method(httpMethod).uri(uri);
                if (requestBody != null) {
                    requestSpec = bodySpec.bodyValue(requestBody);
                } else {
                    requestSpec = bodySpec;
                }
            }

            // Add headers dynamically
            if (headers != null && headers.length > 0) {
                if (headers.length % 2 != 0) {
                    throw new IllegalArgumentException("Headers must be provided as key-value pairs");
                }
                for (int i = 0; i < headers.length; i += 2) {
                    requestSpec.header(headers[i], headers[i + 1]);
                }
            }

            // Execute request and retrieve response
            WebClient.ResponseSpec responseSpec = requestSpec.retrieve();

            // Apply timeout if provided
            T response;
            if (timeout != null) {
                response = responseSpec
                        .bodyToMono(responseType)
                        .timeout(timeout)
                        .block();
            } else {
                response = responseSpec
                        .bodyToMono(responseType)
                        .block();
            }

            return Optional.ofNullable(response)
                    .orElseThrow(() -> new RuntimeException("Received null response from: " + uri));

        } catch (WebClientResponseException e) {
            log.error("{} request failed to {} with status: {} - Response: {}",
                    httpMethod, uri, e.getStatusCode(), e.getResponseBodyAsString(), e);
            throw new RuntimeException("Failed to execute " + httpMethod + " request to " + uri + ": " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error while executing {} request to {}", httpMethod, uri, e);
            throw new RuntimeException("Unexpected error executing " + httpMethod + " request to " + uri, e);
        }
    }

    @Override
    public <T, R> T executePost(String uri, R requestBody, Class<T> responseType, Duration timeout, String... headers) {
        return execute(HttpMethod.POST, uri, requestBody, responseType, timeout, headers);
    }

    @Override
    public <T> T executeGet(String uri, Class<T> responseType, Duration timeout, String... headers) {
        return execute(HttpMethod.GET, uri, null, responseType, timeout, headers);
    }

    @Override
    public <T, R> T executePut(String uri, R requestBody, Class<T> responseType, Duration timeout, String... headers) {
        return execute(HttpMethod.PUT, uri, requestBody, responseType, timeout, headers);
    }

    @Override
    public <T> T executeDelete(String uri, Class<T> responseType, Duration timeout, String... headers) {
        return execute(HttpMethod.DELETE, uri, null, responseType, timeout, headers);
    }

    @Override
    public <T, R> T executePatch(String uri, R requestBody, Class<T> responseType, Duration timeout, String... headers) {
        return execute(HttpMethod.PATCH, uri, requestBody, responseType, timeout, headers);
    }
}
