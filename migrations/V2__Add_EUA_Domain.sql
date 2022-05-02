CREATE domain EUA_ID AS text
constraint check_valid_eua_id check (
    value ~ '^[A-Z0-9]{4}$'
);
