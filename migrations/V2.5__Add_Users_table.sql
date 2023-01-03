CREATE TABLE user_account (
    id UUID PRIMARY KEY NOT NULL,
    username ZERO_STRING,
    is_euaid BOOLEAN NOT NULL,
    common_name ZERO_STRING NOT NULL,
    locale ZERO_STRING NOT NULL,
    email ZERO_STRING NOT NULL,
    given_name ZERO_STRING NOT NULL,
    family_name ZERO_STRING NOT NULL,
    zone_info ZERO_STRING NOT NULL
);

ALTER TABLE user_account
ADD CONSTRAINT unique_username UNIQUE (username);
