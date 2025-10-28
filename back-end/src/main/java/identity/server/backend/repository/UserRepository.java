package identity.server.backend.repository;

import identity.server.backend.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.Set;
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

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.auth0UserId = :auth0UserId")
    Optional<User> findByAuth0UserIdWithRoles(@Param("auth0UserId") String auth0UserId);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id = :id")
    Optional<User> findByIdWithRoles(@Param("id") UUID id);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    @Query("""
       SELECT DISTINCT u FROM User u LEFT JOIN u.roles r
       WHERE (:search IS NULL OR :search = ''
              OR LOWER(CAST(u.email AS string)) LIKE LOWER(CONCAT('%', :search, '%'))
              OR LOWER(CAST(u.username AS string)) LIKE LOWER(CONCAT('%', :search, '%')))
       AND (:isDelete IS NULL OR u.isDelete = :isDelete)
       AND (CAST(:createdDateFrom AS java.time.Instant) IS NULL OR u.createdDate >= :createdDateFrom)
       AND (CAST(:createdDateTo AS java.time.Instant) IS NULL OR u.createdDate <= :createdDateTo)
       AND (:roleIds IS NULL OR r.id IN :roleIds)
       """)
    Page<User> searchUsers(
        @Param("search") String search,
        @Param("isDelete") Boolean isDelete,
        @Param("createdDateFrom") java.time.Instant createdDateFrom,
        @Param("createdDateTo") java.time.Instant createdDateTo,
        @Param("roleIds") Set<UUID> roleIds,
        Pageable pageable);
}
