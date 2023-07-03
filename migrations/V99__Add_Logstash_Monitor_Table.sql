CREATE SCHEMA IF NOT EXISTS config;

CREATE TABLE config.logstash_monitor (
    table_name VARCHAR(255) NOT NULL PRIMARY KEY,
    has_ingested BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO config.logstash_monitor (table_name) VALUES ('change');
