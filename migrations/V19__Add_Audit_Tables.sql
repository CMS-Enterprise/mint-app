CREATE EXTENSION IF NOT EXISTS hstore;

CREATE TABLE audit.table_config (
    id BIGSERIAL PRIMARY KEY,
    schema TEXT NOT NULL,
    name TEXT NOT NULL UNIQUE,
    created_by_field TEXT NOT NULL DEFAULT 'created_by',
    modified_by_field TEXT NOT NULL DEFAULT 'modified_by',
    pkey_field TEXT NOT NULL DEFAULT 'id',
    fkey_field TEXT,
    ignored_fields TEXT,
    --META DATA
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE
);
CREATE UNIQUE INDEX idx_audit_table_config_schema_name ON audit.table_config(schema, name);

CREATE TABLE audit.change (
    id BIGSERIAL PRIMARY KEY,
    table_id INT,
    primary_key UUID NOT NULL,
    foreign_key UUID,
    action TEXT NOT NULL CHECK (action IN ('I', 'D', 'U', 'T')),
    -- field_name TEXT NOT NULL,
    old HSTORE,
    new HSTORE, -- Should we just have time stamp and user?
    fields JSONB,
    modified_by EUA_ID NOT NULL,
    modified_dts TIMESTAMP WITH TIME ZONE NOT NULL

);
ALTER TABLE audit.change
ADD CONSTRAINT fk_change_table FOREIGN KEY (table_id) REFERENCES audit.table_config (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION;


REVOKE ALL ON audit.change FROM public;
