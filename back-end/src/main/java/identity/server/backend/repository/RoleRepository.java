package identity.server.backend.repository;

import identity.server.backend.domain.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCase(String code);

    /**
     * Search roles by code or description with pagination
     * @param search Search keyword (searches in both code and description)
     * @param pageable Pagination and sorting info
     * @return Page of roles
     */
    @Query("SELECT r FROM Role r WHERE " +
           "(LOWER(r.code) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Role> searchRoles(@Param("search") String search, Pageable pageable);
}
