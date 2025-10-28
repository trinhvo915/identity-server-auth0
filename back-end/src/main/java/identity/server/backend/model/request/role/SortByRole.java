package identity.server.backend.model.request.role;

import lombok.Getter;

@Getter
public enum SortByRole {
    REQUEST_CODE("code"),
    CREATED_DATE("createdDate"),
    LAST_MODIFIED_DATE("lastModifiedDate"),
    STATUS("isDelete");
    private final String field;

    SortByRole(String field) {
        this.field = field;
    }

}
