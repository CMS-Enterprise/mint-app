CREATE TABLE config.model_plan_date_changed_email_recipients (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_dts TIMESTAMP WITH TIME ZONE,
  CONSTRAINT email_check CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

-- Trigger to set updated_dts to the current time whenever a row is updated
CREATE OR REPLACE FUNCTION update_updated_dts_column()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_dts = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ab_modtime
  BEFORE UPDATE ON config.model_plan_date_changed_email_recipients
  FOR EACH ROW EXECUTE FUNCTION update_updated_dts_column();
