CREATE TABLE plan_discussion (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL,

    content TEXT NOT NULL,
    status DISCUSSION_STATUS NOT NULL DEFAULT 'UNANSWERED',

    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE
);
ALTER TABLE plan_discussion
ADD CONSTRAINT fk_discussion_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;


CREATE TABLE discussion_reply (
    id UUID PRIMARY KEY NOT NULL,
    discussion_id UUID NOT NULL,
    content TEXT NOT NULL,
    resolution BOOLEAN NOT NULL,

    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE
);

ALTER TABLE discussion_reply
ADD CONSTRAINT fk_reply_discussion FOREIGN KEY (discussion_id)
REFERENCES public.plan_discussion (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;
