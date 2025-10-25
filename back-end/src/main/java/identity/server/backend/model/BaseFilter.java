package identity.server.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.domain.Sort;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class BaseFilter {
    private Integer size;
    private Integer page;
    private Sort.Direction orderBy;
    private String sortBy;
    private String searchTerm;
}
