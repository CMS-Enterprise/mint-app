WITH  links AS (
    SELECT "key", "value" FROM
        link_key_and_array(
            'COMM_W_PART',
            '{GOVDELIVERY, OUTLOOK_MAILBOX, POST_PORTAL, POST_PORTAL}'
        )
    UNION 
    SELECT "key", "value" FROM link_key_and_array(
        'COMM_W_PART',
        '{GOVDELIVERY, OUTLOOK_MAILBOX, POST_PORTAL,MDM_POR}'
    )
)

SELECT * FROM links
