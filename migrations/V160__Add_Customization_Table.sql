CREATE TYPE VIEW_CUSTOMIZATION_TYPE AS ENUM (
  'MY_MODEL_PLANS',
  'ALL_MODEL_PLANS',
  'FOLLOWED_MODELS',
  'MODELS_WITH_CR_TDL',
  'MODELS_BY_OPERATIONAL_SOLUTION'
);

CREATE TABLE user_view_customization (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user_account(id),
  view_customization VIEW_CUSTOMIZATION_TYPE[] NOT NULL DEFAULT '{}',
  possible_operational_solutions OPERATIONAL_SOLUTION_KEY[] NOT NULL DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES user_account(id),
  created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_by UUID REFERENCES user_account(id),
  modified_dts TIMESTAMP WITH TIME ZONE
);

/* Enable Auditing for new table*/
SELECT audit.AUDIT_TABLE('public', 'user_view_customization', 'id', 'user_id', '{created_by,created_dts,modified_by,modified_dts}'::TEXT[], '{}'::TEXT[]);

COMMENT ON COLUMN user_view_customization.user_id IS
'This column represents which user (uuid) the view customization is for.';

COMMENT ON COLUMN user_view_customization.view_customization IS
'This column represents an list (ordered) of VIEW_CUSTOMIZATION_TYPE that the user has selected for their home page.';

COMMENT ON COLUMN user_view_customization.possible_operational_solutions IS
'This column represents a list of Operational Solution Keys that the user has selected to view. This selection is used when the user has also selected MODELS_BY_OPERATIONAL_SOLUTION as a view type.';
