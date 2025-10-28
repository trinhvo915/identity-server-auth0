package identity.server.backend.model.request.user;

import lombok.Getter;

@Getter
public enum SortByUser {
    EMAIL("email"),
    USERNAME("username"),
    CREATED_DATE("createdDate"),
    STATUS("isDelete");
    private final String field;

    SortByUser(String field) {
        this.field = field;
    }

}
