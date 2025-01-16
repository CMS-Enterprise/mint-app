-- Do union selects to select needs and an array of keys
WITH  links AS (
    SELECT
        "key",
        "value"
    FROM link_key_and_array('MANAGE_CD', '{MARX}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('REV_COL_BIDS', '{HPMS}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('UPDATE_CONTRACT', '{HPMS}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('SIGN_PARTICIPATION_AGREEMENTS', '{INNOVATION}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('RECRUIT_PARTICIPANTS', '{GS, CMS_QUALTRICS, LOI, RFA}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('REV_SCORE_APP', '{GS, ARS}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('APP_SUPPORT_CON', '{RMADA}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('COMM_W_PART', '{GOVDELIVERY, OUTLOOK_MAILBOX, POST_PORTAL}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('VET_PROVIDERS_FOR_PROGRAM_INTEGRITY', '{CPI_VETTING}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('MANAGE_PROV_OVERLAP', '{MDM_POR}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('MANAGE_BEN_OVERLAP', '{MDM_POR}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('HELPDESK_SUPPORT', '{CBOSC}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('IDDOC_SUPPORT', '{INNOVATION, ACO_OS}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('ESTABLISH_BENCH', '{IDR, CCW}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('PROCESS_PART_APPEALS', '{LV}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('ACQUIRE_AN_EVAL_CONT', '{RMADA}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('DATA_TO_MONITOR', '{CDX, CCW, HDR, IDR, POST_PORTAL}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('DATA_TO_SUPPORT_EVAL', '{CDX, CCW, HDR, POST_PORTAL}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('CLAIMS_BASED_MEASURES', '{IDR, CCW}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('QUALITY_PERFORMANCE_SCORES', '{HDR}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('SEND_REPDATA_TO_PART', '{INNOVATION, BCDA, CDX, CMS_BOX, EFT, EDFR, RMADA, POST_PORTAL}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('UTILIZE_QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR', '{QV, MIDS}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('ACQUIRE_A_LEARN_CONT', '{RMADA}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('PART_TO_PART_COLLAB', '{CONNECT}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('EDUCATE_BENEF', '{LDG}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('IT_PLATFORM_FOR_LEARNING', '{CONNECT}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('ADJUST_FFS_CLAIMS', '{SHARED_SYSTEMS, HIGLAS}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('MANAGE_FFS_EXCL_PAYMENTS', '{SHARED_SYSTEMS}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('MAKE_NON_CLAIMS_BASED_PAYMENTS', '{APPS, HIGLAS, IPC, MDM_NCBP}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('COMPUTE_SHARED_SAVINGS_PAYMENT', '{RMADA}')
    UNION
    SELECT
        "key",
        "value"
    FROM link_key_and_array('RECOVER_PAYMENTS', '{APPS, IPC, SHARED_SYSTEMS}')
)

-- Insert into common milestone link from the union select that combines the keys

INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
SELECT
    cast( key AS MTO_COMMON_MILESTONE_KEY) AS milestone,
    cast( value AS MTO_COMMON_SOLUTION_KEY) AS solution
FROM links
