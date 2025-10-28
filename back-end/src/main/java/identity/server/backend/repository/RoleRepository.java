package identity.server.backend.repository;

import identity.server.backend.domain.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCase(String code);

    /**
     * Search roles by code or description with pagination and status filter
     * @param search Search keyword (searches in both code and description)
     * @param isDelete Filter by isDelete status (null = all, true = deleted, false = active)
     * @param createdDateFrom Filter roles created from this date (inclusive, UTC time)
     * @param createdDateTo Filter roles created until this date (inclusive, UTC time)
     * @param pageable Pagination and sorting info
     * @return Page of roles
     */
    @Query("""
       SELECT r FROM Role r
       WHERE (:search IS NULL OR :search = ''
              OR LOWER(CAST(r.code AS string)) LIKE LOWER(CONCAT('%', :search, '%'))
              OR LOWER(CAST(r.description AS string)) LIKE LOWER(CONCAT('%', :search, '%')))
       AND (:isDelete IS NULL OR r.isDelete = :isDelete)
       AND (CAST(:createdDateFrom AS java.time.Instant) IS NULL OR r.createdDate >= :createdDateFrom)
       AND (CAST(:createdDateTo AS java.time.Instant) IS NULL OR r.createdDate <= :createdDateTo)
       """)
    Page<Role> searchRoles(
        @Param("search") String search,
        @Param("isDelete") Boolean isDelete,
        @Param("createdDateFrom") java.time.Instant createdDateFrom,
        @Param("createdDateTo") java.time.Instant createdDateTo,
        Pageable pageable);

    @Query("SELECT r FROM Role r WHERE r.isDelete = false ORDER BY r.code ASC")
    List<Role> findAllActiveRoles();
}
