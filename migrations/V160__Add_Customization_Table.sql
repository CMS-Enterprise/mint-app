CREATE TYPE VIEW_CUSTOMIZATION_TYPE AS ENUM (
  'MY_MODEL_PLANS',
  'ALL_MODEL_PLANS',
  'FOLLOWED_MODELS',
  'MODELS_WITH_CR_TDL',
  'MODELS_BY_OPERATIONAL_SOLUTION'
);

CREATE TABLE user_view_customization (
  id UUID PRIMARY KEY,
  user_id UUID references user_account(id),
  view_customization VIEW_CUSTOMIZATION_TYPE[] DEFAULT NULL,
  possible_operational_solutions UUID[] DEFAULT NULL,
  created_by UUID NOT NULL REFERENCES user_account(id),
  created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_by UUID REFERENCES user_account(id),
  modified_dts TIMESTAMP WITH TIME ZONE
);
