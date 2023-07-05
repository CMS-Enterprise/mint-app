CREATE TABLE config.model_plan_date_changed_email_recipients (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  CONSTRAINT email_check CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
  CONSTRAINT unique_email UNIQUE(email)
);
