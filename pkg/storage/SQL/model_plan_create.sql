INSERT INTO model_plan (
        id,
        model_name,
        model_category,
        cms_center,
        cmmi_group,
        created_by,
        modified_by
    )
VALUES (
        :id,
        :model_name,
        :model_category,
        :cms_center,
        :cmmi_group,
        :created_by,
        :modified_by
    )
    RETURNING *;
