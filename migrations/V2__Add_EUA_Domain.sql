CREATE domain eua_id AS text
constraint check_valid_eua_id check (
    value ~ '^[A-Z0-9]{4}$'
);
