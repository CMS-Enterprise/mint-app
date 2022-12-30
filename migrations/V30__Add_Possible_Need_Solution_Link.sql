CREATE TABLE possible_need_solution_link ( -- this is an entry for each solution that works for a need
    id SERIAL PRIMARY KEY NOT NULL,
    need_type INT NOT NULL,
    solution_type INT NOT NULL,

    --META DATA
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE

);
