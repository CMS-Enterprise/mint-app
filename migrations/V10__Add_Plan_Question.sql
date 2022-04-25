CREATE TABLE plan_question (
    id uuid PRIMARY KEY,
    model_plan_id uuid NOT NULL,
    section task_section NOT NULL,
    page SMALLINT NOT NULL,
    question text NOT NULL,
    status question_status NOT NULL DEFAULT 'NEW',

    created_by eua_id NOT NULL,
    created_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by eua_id NOT NULL,
    modified_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE plan_question
    ADD CONSTRAINT fk_question_plan FOREIGN KEY (model_plan_id)
        REFERENCES public.model_plan (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
;


CREATE TABLE question_comment (
    id uuid PRIMARY KEY,
    thread_id uuid,
    comment text,
    resolution boolean,

    created_by eua_id NOT NULL,
    created_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by eua_id NOT NULL,
    modified_dts timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE question_comment
    ADD CONSTRAINT fk_comment_thread FOREIGN KEY (thread_id)
        REFERENCES public.plan_question (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
;
