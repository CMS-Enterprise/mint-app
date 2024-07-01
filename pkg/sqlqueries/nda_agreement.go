package sqlqueries

import _ "embed"

//go:embed SQL/nda_agreement/get_by_user_id.sql
var ndaAgreementGetByUserIDSQL string

//go:embed SQL/nda_agreement/update.sql
var ndaAgreementUpdateSQL string

//go:embed SQL/nda_agreement/insert.sql
var ndaAgreementInsertSQL string

type ndaAgreementScripts struct {
	GetByUserID string
	Update      string
	Insert      string
}

// NDAAgreement houses all the sql for getting data for nda agreement from the database
var NDAAgreement = ndaAgreementScripts{
	GetByUserID: ndaAgreementGetByUserIDSQL,
	Update:      ndaAgreementUpdateSQL,
	Insert:      ndaAgreementInsertSQL,
}
