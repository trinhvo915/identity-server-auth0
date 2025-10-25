package identity.server.backend.model.request.role;

public enum SortByRole {
    REQUEST_CODE("code");
    private final String field;


    SortByRole(String field) {
        this.field = field;
    }

    public String getField() {
        return this.field;
    }
}
