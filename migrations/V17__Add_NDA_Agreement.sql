CREATE TABLE nda_agreement (
    id UUID PRIMARY KEY NOT NULL,
    --page 1
    user_id UUID NOT NULL UNIQUE,
    agreed BOOLEAN NOT NULL,
    agreed_dts TIMESTAMP WITH TIME ZONE,
    --META DATA
    created_by UUID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID,
    modified_dts TIMESTAMP WITH TIME ZONE
);
ALTER TABLE nda_agreement
ADD CONSTRAINT fk_nda_user FOREIGN KEY (user_id)
REFERENCES public.user_account (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;


ALTER TABLE nda_agreement
ADD CONSTRAINT fk_nda_created_by FOREIGN KEY (created_by)
REFERENCES public.user_account (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;

ALTER TABLE nda_agreement
ADD CONSTRAINT fk_nda_modified_by FOREIGN KEY (modified_by)
REFERENCES public.user_account (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION;
