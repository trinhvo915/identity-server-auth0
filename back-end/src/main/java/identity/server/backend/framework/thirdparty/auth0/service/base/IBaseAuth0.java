package identity.server.backend.framework.thirdparty.auth0.service.base;

import identity.server.backend.framework.thirdparty.auth0.model.Auth0M2MConfig;
import org.springframework.http.HttpMethod;

import java.time.Duration;

public interface IBaseAuth0 {
    String getAccessToken(Auth0M2MConfig auth0M2MConfig) throws RuntimeException;

    /**
     * Generic method to execute HTTP requests with WebClient (supports all HTTP methods)
     * @param httpMethod The HTTP method (GET, POST, PUT, DELETE, PATCH)
     * @param uri The target URI
     * @param requestBody The request body object (can be null for GET/DELETE)
     * @param responseType The expected response class type
     * @param timeout Optional timeout duration (can be null)
     * @param headers Optional headers as key-value pairs
     * @param <T> Response type
     * @param <R> Request type
     * @return The response object
     */
    <T, R> T execute(HttpMethod httpMethod, String uri, R requestBody, Class<T> responseType, Duration timeout, String... headers);

    /**
     * Convenience method for GET requests (no request body)
     */
    <T> T executeGet(String uri, Class<T> responseType, Duration timeout, String... headers);

    /**
     * Convenience method for POST requests
     */
    <T, R> T executePost(String uri, R requestBody, Class<T> responseType, Duration timeout, String... headers);

    /**
     * Convenience method for PUT requests
     */
    <T, R> T executePut(String uri, R requestBody, Class<T> responseType, Duration timeout, String... headers);

    /**
     * Convenience method for DELETE requests (no request body)
     */
    <T> T executeDelete(String uri, Class<T> responseType, Duration timeout, String... headers);

    /**
     * Convenience method for PATCH requests
     */
    <T, R> T executePatch(String uri, R requestBody, Class<T> responseType, Duration timeout, String... headers);
}
