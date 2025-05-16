package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_solution_contact/collection_get_by_mto_common_solution_key.sql
var MTOCommonSolutionContactsGetByMTOCommonSolutionKeyLOADERSQL string

type MTOCommonSolutionContactScripts struct {
	CollectionGetByCommonSolutionKeyLOADER string
}

// MTOCommonSolutionContact houses all the sql for getting data for common solution contact from the database
var MTOCommonSolutionContact = MTOCommonSolutionContactScripts{
	CollectionGetByCommonSolutionKeyLOADER: MTOCommonSolutionContactsGetByMTOCommonSolutionKeyLOADERSQL,
}
