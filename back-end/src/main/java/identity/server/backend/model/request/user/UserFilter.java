package identity.server.backend.model.request.user;

import identity.server.backend.model.BaseFilter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class UserFilter extends BaseFilter {
    private SortByUser sortByUser;
    private Boolean status;
    private Instant createdDateFrom;
    private Instant createdDateTo;
    private Set<UUID> roleIds;
}
