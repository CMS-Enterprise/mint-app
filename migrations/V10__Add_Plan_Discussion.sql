CREATE TABLE plan_discussion (
    id uuid PRIMARY KEY,
    model_plan_id uuid NOT NULL,

    content text NOT NULL,
    status discussion_status NOT NULL DEFAULT 'NEW',

    created_by eua_id NOT NULL,
    created_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by eua_id NOT NULL,
    modified_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE plan_discussion
    ADD CONSTRAINT fk_discussion_plan FOREIGN KEY (model_plan_id)
        REFERENCES public.model_plan (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
;


CREATE TABLE discussion_reply (
    id uuid PRIMARY KEY,
    discussion_id uuid,
    content text,
    resolution boolean,

    created_by eua_id NOT NULL,
    created_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by eua_id NOT NULL,
    modified_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE discussion_reply
    ADD CONSTRAINT fk_reply_discussion FOREIGN KEY (discussion_id)
        REFERENCES public.plan_discussion (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
;
