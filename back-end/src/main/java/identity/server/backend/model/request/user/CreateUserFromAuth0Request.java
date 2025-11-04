package identity.server.backend.model.request.user;

import lombok.Data;

@Data
public class CreateUserFromAuth0Request {
    private String sub;
    private String email;
    private String name;
    private String picture;
}