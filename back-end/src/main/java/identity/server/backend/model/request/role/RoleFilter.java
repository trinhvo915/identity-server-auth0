package identity.server.backend.model.request.role;

import identity.server.backend.model.BaseFilter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class RoleFilter extends BaseFilter {
    private SortByRole sortByRole;
    private Boolean status;
    private Instant createdDateFrom;
    private Instant createdDateTo;
}
