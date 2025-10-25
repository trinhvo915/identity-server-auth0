package identity.server.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.io.Serial;
import java.io.Serializable;
import java.util.*;

@Entity
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User extends AbstractAuditingEntity<UUID> implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.UUID)
    @Column(name = "id")
    private UUID id;

    @NotNull(message = "Username is required")
    @Size(min = 1, max = 50)
    @Column(name = "username", length = 50, unique = true, nullable = false)
    private String username;

    @Email
    @Size(min = 5, max = 254)
    @Column(name = "email", length = 254)
    private String email;

    @Size(max = 100)
    @Column(name = "auth0_user_id", length = 100)
    private String auth0UserId;

    @Size(max = 100)
    @Column(name = "name", length = 100)
    private String name;

    @Builder.Default
    @NotNull
    @Column(name = "activated", nullable = false)
    private boolean activated = false;

    @Column(name = "url_avatar", columnDefinition = "LONGTEXT")
    private String urlAvatar;

    @Builder.Default
    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "user_role",
            joinColumns = { @JoinColumn(name = "user_id", referencedColumnName = "id") },
            inverseJoinColumns = { @JoinColumn(name = "role_id", referencedColumnName = "id") }
    )
    @BatchSize(size = 20)
    private Set<Role> roles = new HashSet<>();

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}