package identity.server.backend.repository;

import identity.server.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Find user by ID with pessimistic write lock (SELECT FOR UPDATE)
     * This prevents concurrent instances from creating duplicate users
     *
     * @param id User ID
     * @return Optional User with exclusive lock
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT u FROM User u WHERE u.id = :id")
    Optional<User> findByIdWithLock(@Param("id") UUID id);

    /**
     * Find user by Auth0 user ID with their roles
     * Uses JOIN FETCH to eagerly load roles in a single query
     *
     * @param auth0UserId Auth0 user ID from JWT sub claim
     * @return Optional User with roles loaded
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.auth0UserId = :auth0UserId")
    Optional<User> findByAuth0UserIdWithRoles(@Param("auth0UserId") String auth0UserId);
}
