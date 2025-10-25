package identity.server.backend.web.rest;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/roles", produces = MediaType.APPLICATION_JSON_VALUE)
public class RoleController {

}
