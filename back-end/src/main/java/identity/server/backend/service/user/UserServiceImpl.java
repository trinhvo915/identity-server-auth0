package identity.server.backend.service.user;

import identity.server.backend.domain.Role;
import identity.server.backend.domain.User;
import identity.server.backend.framework.constants.AuthoritiesConstants;
import identity.server.backend.framework.constants.MessageConstants;
import identity.server.backend.framework.exception.BadRequestException;
import identity.server.backend.framework.exception.NotFoundException;
import identity.server.backend.framework.thirdparty.auth0.model.Auth0UserResponse;
import identity.server.backend.framework.thirdparty.auth0.model.CreateUserAuth0Request;
import identity.server.backend.framework.thirdparty.auth0.model.UpdateUserRequest;
import identity.server.backend.framework.thirdparty.auth0.service.user.IAuth0UserService;
import identity.server.backend.model.request.user.CreateUserFromAuth0Request;
import identity.server.backend.model.request.user.CreateUserRequest;
import identity.server.backend.model.request.user.UpdateRoleUserRequest;
import identity.server.backend.model.request.user.UpdateUserProfileRequest;
import identity.server.backend.model.request.user.UserFilter;
import identity.server.backend.model.response.user.UserResponse;
import identity.server.backend.repository.RoleRepository;
import identity.server.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final IAuth0UserService auth0UserService;

    private static final String AUTH0_CONNECTION = "Username-Password-Authentication";

    @Override
    @Transactional(readOnly = true)
    public User findByIdWithLock(UUID userId) {
        log.debug("Finding user by ID with lock: {}", userId);
        return userRepository.findByIdWithLock(userId).orElse(null);
    }

    @Override
    @Transactional
    public void updateAuth0UserId(User user, String auth0UserId, String urlAvatar) {
        log.debug("Updating Auth0 user ID for user: {}", user.getId());

        user.setUrlAvatar(urlAvatar);
        user.setAuth0UserId(auth0UserId);
        user.setLastModifiedBy("AUTH0_SYNC");
        user.setLastModifiedDate(Instant.now());

        userRepository.save(user);
        log.info("Updated Auth0 user ID for user: {}. Auth0UserId: {}", user.getId(), auth0UserId);
    }

    @Override
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        log.info("Creating user with email: {}", request.getEmail());

        User existingUser = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (existingUser != null) {
            if (!existingUser.isDelete()) {
                log.warn("User with email {} already exists and is active", request.getEmail());
                throw new BadRequestException(MessageConstants.USER_EMAIL_ALREADY_EXISTS);
            } else {
                log.info("Reactivating deleted user with email: {}", request.getEmail());
                return reactivateUser(existingUser, request);
            }
        }

        return createNewUser(request);
    }

    private UserResponse createNewUser(CreateUserRequest request) {
        log.debug("Creating new user in database");

        Role userRole = roleRepository.findByCodeIgnoreCase(AuthoritiesConstants.USER)
                .orElseThrow(() -> new BadRequestException("Default USER role not found"));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .name(request.getName())
                .activated(true)
                .roles(new HashSet<>(Set.of(userRole)))
                .isDelete(false)
                .build();

        User savedUser = userRepository.save(user);
        log.info("User saved to database with ID: {}", savedUser.getId());

        try {
            CreateUserAuth0Request auth0Request = CreateUserAuth0Request.builder()
                    .email(request.getEmail())
                    // Don't send username to Auth0 as the connection doesn't support it
                    // .username(request.getUsername())
                    .password(request.getPassword())
                    .name(request.getName())
                    .givenName(null)
                    .familyName(null)
                    .connection(AUTH0_CONNECTION)
                    .emailVerified(false)
                    .blocked(false)
                    .build();

            Auth0UserResponse auth0Response = auth0UserService.createUser(auth0Request);
            log.info("User created in Auth0 with ID: {}", auth0Response.getUserId());

            savedUser.setAuth0UserId(auth0Response.getUserId());
            savedUser.setUrlAvatar(auth0Response.getPicture());
            savedUser.setLastModifiedDate(Instant.now());

            savedUser = userRepository.save(savedUser);
            log.info("User updated with Auth0 details");

            return UserResponse.mapToUserResponse(savedUser, MessageConstants.CREATE_USER_SUCCESS);

        } catch (Exception e) {
            log.error("Failed to create user in Auth0, rolling back database transaction", e);
            throw new BadRequestException("Failed to create user in Auth0: " + e.getMessage());
        }
    }

    private UserResponse reactivateUser(User user, CreateUserRequest request) {
        log.debug("Reactivating user in database: {}", user.getId());

        user.setDelete(false);
        user.setActivated(true);
        user.setLastModifiedDate(Instant.now());

        User savedUser = userRepository.save(user);
        log.info("User reactivated in database: {}", savedUser.getId());

        try {
            if (user.getAuth0UserId() != null) {
                Auth0UserResponse existingAuth0User = auth0UserService.getUserFilterAuth0Id(user.getAuth0UserId());

                if (existingAuth0User != null) {
                    auth0UserService.blockUser(user.getAuth0UserId(), false);
                    log.info("User unblocked in Auth0: {}", user.getAuth0UserId());
                } else {
                    log.warn("Auth0 user not found, creating new Auth0 user");
                    createAuth0UserForReactivation(savedUser, request);
                }
            } else {
                log.warn("No Auth0 user ID found, creating new Auth0 user");
                createAuth0UserForReactivation(savedUser, request);
            }

            return UserResponse.mapToUserResponse(savedUser, MessageConstants.USER_REACTIVATED_SUCCESS);

        } catch (Exception e) {
            log.error("Failed to reactivate user in Auth0", e);
            throw new BadRequestException("Failed to reactivate user in Auth0: " + e.getMessage());
        }
    }

    private void createAuth0UserForReactivation(User user, CreateUserRequest request) {
       CreateUserAuth0Request auth0Request = CreateUserAuth0Request.builder()
                .email(user.getEmail())
                .password(request.getPassword())
                .name(request.getName())
                .givenName(null)
                .familyName(null)
                .connection(AUTH0_CONNECTION)
                .emailVerified(false)
                .blocked(false)
                .build();

        Auth0UserResponse auth0Response = auth0UserService.createUser(auth0Request);
        log.info("New Auth0 user created for reactivation: {}", auth0Response.getUserId());

        user.setAuth0UserId(auth0Response.getUserId());
        user.setUrlAvatar(auth0Response.getPicture());
        user.setLastModifiedDate(Instant.now());

        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserResponse updateRoleUser(UUID userId, UpdateRoleUserRequest request) {
        log.info("Updating user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.USER_NOT_FOUND));

        if (user.isDelete()) {
            log.warn("Cannot update deleted user: {}", userId);
            throw new BadRequestException("Cannot update deleted user");
        }

        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
            Set<Role> newRoles = new HashSet<>(roleRepository.findAllById(request.getRoleIds()));

            if (newRoles.size() != request.getRoleIds().size()) {
                Set<UUID> foundRoleIds = newRoles.stream()
                        .map(Role::getId)
                        .collect(Collectors.toSet());
                Set<UUID> missingRoleIds = new HashSet<>(request.getRoleIds());
                missingRoleIds.removeAll(foundRoleIds);
                throw new BadRequestException("Role(s) not found with ID(s): " + missingRoleIds);
            }

            Set<String> deletedRoleCodes = newRoles.stream()
                    .filter(Role::isDelete)
                    .map(Role::getCode)
                    .collect(Collectors.toSet());
            if (!deletedRoleCodes.isEmpty()) {
                throw new BadRequestException("Cannot assign deleted role(s): " + deletedRoleCodes);
            }

            user.setRoles(newRoles);
            log.info("User roles updated: {}", newRoles.stream().map(Role::getCode).collect(Collectors.toSet()));
        }

        user.setLastModifiedDate(Instant.now());
        User savedUser = userRepository.save(user);
        log.info("User updated in database: {}", userId);
        return UserResponse.mapToUserResponse(savedUser, MessageConstants.UPDATE_USER_SUCCESS);
    }

    @Override
    @Transactional
    public UserResponse deleteUser(UUID userId) {
        log.info("Deleting user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.USER_NOT_FOUND));

        if (user.isDelete()) {
            log.warn("User is already deleted: {}", userId);
            throw new BadRequestException(MessageConstants.USER_ALREADY_DELETED);
        }

        user.setDelete(true);
        user.setActivated(false);
        user.setLastModifiedDate(Instant.now());

        User savedUser = userRepository.save(user);
        log.info("User soft deleted in database: {}", userId);

        if (user.getAuth0UserId() != null) {
            try {
                auth0UserService.blockUser(user.getAuth0UserId(), true);
                log.info("User blocked in Auth0: {}", user.getAuth0UserId());

            } catch (Exception e) {
                log.error("Failed to block user in Auth0, but database was updated", e);
            }
        } else {
            log.warn("User has no Auth0 user ID, skipping Auth0 block");
        }

        return UserResponse.mapToUserResponse(savedUser, MessageConstants.DELETE_USER_SUCCESS);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserProfile(String auth0UserId) {
        log.info("Getting user profile for Auth0 user ID: {}", auth0UserId);

        User user = userRepository.findByAuth0UserIdWithRoles(auth0UserId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.USER_NOT_FOUND));

        if (user.isDelete()) {
            log.warn("User profile requested for deleted user: {}", auth0UserId);
            throw new BadRequestException("User account is deleted");
        }

        log.info("User profile retrieved successfully for: {}", auth0UserId);
        return UserResponse.mapToUserResponse(user, "User profile retrieved successfully.");
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> searchUsers(UserFilter userFilter) {
        log.debug("Searching users with filter: search='{}', status={}, createdDateFrom={}, createdDateTo={}, page={}, size={}, sortBy={}, orderBy={}",
                userFilter.getSearchTerm(),
                userFilter.getStatus(),
                userFilter.getCreatedDateFrom(),
                userFilter.getCreatedDateTo(),
                userFilter.getPage(),
                userFilter.getSize(),
                userFilter.getSortByUser(),
                userFilter.getOrderBy());

        String sortField = userFilter.getSortByUser() != null
                ? userFilter.getSortByUser().getField()
                : "email";

        Sort.Direction direction = userFilter.getOrderBy() != null
                ? userFilter.getOrderBy()
                : Sort.Direction.ASC;

        Sort sort = Sort.by(direction, sortField);

        int page = userFilter.getPage() != null ? userFilter.getPage() : 0;
        int size = userFilter.getSize() != null ? userFilter.getSize() : 20;
        Pageable pageable = PageRequest.of(page, size, sort);

        String searchTerm = userFilter.getSearchTerm();
        String normalizedSearch = (searchTerm != null && !searchTerm.isBlank())
                ? searchTerm.trim()
                : null;

        Boolean isDelete = userFilter.getStatus();

        Page<User> users = userRepository.searchUsers(
                normalizedSearch,
                isDelete,
                userFilter.getCreatedDateFrom(),
                userFilter.getCreatedDateTo(),
                userFilter.getRoleIds(),
                pageable
        );

        return users.map(user -> UserResponse.mapToUserResponse(user, null));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserDetail(UUID userId) {
        log.info("Getting user detail for user ID: {}", userId);

        User user = userRepository.findByIdWithRoles(userId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.USER_NOT_FOUND));

        log.info("User detail retrieved successfully for user ID: {}", userId);
        return UserResponse.mapToUserResponse(user, "User detail retrieved successfully.");
    }

    @Override
    @Transactional
    public UserResponse updateUserProfile(String auth0UserId, UpdateUserProfileRequest request) {
        log.info("Updating user profile for Auth0 user ID: {}", auth0UserId);

        User user = userRepository.findByAuth0UserIdWithRoles(auth0UserId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.USER_NOT_FOUND));

        if (user.isDelete()) {
            log.warn("Cannot update profile for deleted user: {}", auth0UserId);
            throw new BadRequestException("Cannot update deleted user");
        }

        user.setName(request.getName());
        user.setLastModifiedDate(Instant.now());

        User savedUser = userRepository.save(user);
        log.info("User profile updated in database: {}", user.getId());

        if (user.getAuth0UserId() != null) {
            try {
                UpdateUserRequest auth0UpdateRequest = UpdateUserRequest.builder()
                        .name(request.getName())
                        .password(request.getPassword())
                        .build();

                auth0UserService.updateUser(user.getAuth0UserId(), auth0UpdateRequest);
                log.info("User profile updated in Auth0: {}", user.getAuth0UserId());

            } catch (Exception e) {
                log.error("Failed to update user profile in Auth0, but database was updated", e);
                throw new BadRequestException("Failed to update user profile in Auth0: " + e.getMessage());
            }
        } else {
            log.warn("User has no Auth0 user ID, skipping Auth0 update");
        }

        return UserResponse.mapToUserResponse(savedUser, MessageConstants.UPDATE_USER_SUCCESS);
    }

    @Override
    @Transactional
    public UserResponse activateUser(UUID userId) {
        log.info("Activating user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(MessageConstants.USER_NOT_FOUND));

        if (!user.isDelete()) {
            log.warn("User is already active: {}", userId);
            throw new BadRequestException("User is already active");
        }

        user.setDelete(false);
        user.setActivated(true);
        user.setLastModifiedDate(Instant.now());

        User savedUser = userRepository.save(user);
        log.info("User activated in database: {}", userId);

        if (user.getAuth0UserId() != null) {
            try {
                auth0UserService.blockUser(user.getAuth0UserId(), false);
                log.info("User unblocked in Auth0: {}", user.getAuth0UserId());

            } catch (Exception e) {
                log.error("Failed to unblock user in Auth0, but database was updated", e);
            }
        } else {
            log.warn("User has no Auth0 user ID, skipping Auth0 unblock");
        }

        return UserResponse.mapToUserResponse(savedUser, "User activated successfully.");
    }

    @Override
    @Transactional
    public UserResponse syncUserFromAuth0AndGetRoles(CreateUserFromAuth0Request request) {
        log.info("Creating user from Auth0 with sub: {}", request.getSub());

        Optional<User> existUser = userRepository.findByAuth0UserIdWithRoles(request.getSub());
        if (existUser.isPresent()) {
            log.info("User with Auth0 ID {} already exists, skipping creation", request.getSub());
            return UserResponse.mapToUserResponse(existUser.get(), MessageConstants.USER_ALREADY_EXISTS);
        }

        Role userRole = roleRepository.findByCodeIgnoreCase(AuthoritiesConstants.USER)
                .orElseThrow(() -> new BadRequestException("Default USER role not found"));

        User user = User.builder()
                .username(request.getEmail())
                .email(request.getEmail())
                .name(request.getName())
                .urlAvatar(request.getPicture())
                .auth0UserId(request.getSub())
                .activated(true)
                .roles(new HashSet<>(Set.of(userRole)))
                .isDelete(false)
                .build();

        userRepository.save(user);
        log.info("User created from Auth0 with ID: {}", user.getId());
        return UserResponse.mapToUserResponse(user, MessageConstants.CREATE_USER_SUCCESS);
    }
}
