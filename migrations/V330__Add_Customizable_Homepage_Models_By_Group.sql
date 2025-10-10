-- Add additional view customization type
ALTER TYPE VIEW_CUSTOMIZATION_TYPE ADD VALUE 'MODELS_BY_GROUP';

-- Add new component group type
CREATE TYPE COMPONENT_GROUP_TYPE AS ENUM (
    'CCMI_PCMG',
    'CCMI_PPG',
    'CCMI_SCMG',
    'CCMI_SPHG',
    'CCMI_TBD',
    'CCSQ',
    'CMCS',
    'CM',
    'FCHCO',
    'CPI'
);

-- Add new column to user_view_customization table
ALTER TABLE user_view_customization
ADD COLUMN component_groups COMPONENT_GROUP_TYPE[] DEFAULT '{}'::COMPONENT_GROUP_TYPE[];

COMMENT ON COLUMN user_view_customization.component_groups IS 'This column represents a list of Component/Group Types that the user has selected to view. This selection is used when the user has also selected MODELS_BY_GROUP as a view type.';
