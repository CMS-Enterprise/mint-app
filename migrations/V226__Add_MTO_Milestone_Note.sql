-- Add MTO milestone note table
CREATE TABLE mto_milestone_note (
    id UUID PRIMARY KEY NOT NULL,
    mto_milestone_id UUID NOT NULL,
    content ZERO_STRING NOT NULL,
    created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE
);
ALTER TABLE mto_milestone_note
ADD CONSTRAINT fk_mto_milestone_note FOREIGN KEY (mto_milestone_id)
REFERENCES public.mto_milestone (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;
