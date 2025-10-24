CREATE PROCEDURE `generate_users`()
BEGIN
    DECLARE i INT DEFAULT 3;

    WHILE i < 55 DO
        INSERT INTO user (
            id, username, email, mobile, password, first_name, last_name, title,
            activated, reset_key, reset_date, url_avatar, created_by, created_date,
            last_modified_by, last_modified_date, is_delete
        )
        VALUES (
            UUID(), CONCAT('admin', i), CONCAT('admin', i, '@gmail.com'), NULL, 'password', NULL, NULL, NULL,
            TRUE, NULL, NULL, NULL, 'system', NOW(), 'system', NOW(), FALSE
        );

        SET i = i + 1;
END WHILE;
END;