INSERT INTO config.model_plan_date_changed_email_recipients(
    email
)
VALUES (
    :email
)
RETURNING id,
email
