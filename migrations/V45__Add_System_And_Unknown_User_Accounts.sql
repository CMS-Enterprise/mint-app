-- Create System Account
INSERT INTO "public"."user_account"("id", "username", "is_euaid", "common_name", "locale", "email", "given_name", "family_name", "zone_info", "has_logged_in") VALUES('00000001-0001-0001-0001-000000000001', 'MINT_SYSTEM', FALSE, 'Mint System Account', 'en_US', 'UNKNOWN@UNKNOWN.UNKNOWN', 'Mint', 'System Account', 'UNKNOWN', TRUE) RETURNING "id", "username", "is_euaid", "common_name", "locale", "email", "given_name", "family_name", "zone_info", "has_logged_in";
/*
Handle any cases of referenced 'MINT' EUAID account
*/

/* Update any existing pointers to the MINT account to point to the system account instead
Currently, only plan_favorite and NDA exist
*/


-- Create Unkown Account
INSERT INTO "public"."user_account"("id", "username", "is_euaid", "common_name", "locale", "email", "given_name", "family_name", "zone_info", "has_logged_in") VALUES('00000000-0000-0000-0000-000000000000', 'UNKNOWN_USER', FALSE, 'UNKNOWN USER ACCOUNT', 'UNKNOWN', 'UNKNOWN@UNKNOWN.UNKNOWN', 'UNKNOWN', 'UNKNOWN', 'UNKNOWN', TRUE) RETURNING "id", "username", "is_euaid", "common_name", "locale", "email", "given_name", "family_name", "zone_info", "has_logged_in";

/* Update any existing pointers to the UNKN account to point to the system account instead
This should only be in the audit change table
*/
