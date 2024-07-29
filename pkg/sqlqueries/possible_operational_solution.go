package sqlqueries

import _ "embed"

//go:embed SQL/possible_operational_solution/collection_get_by_need_type.sql
var possibleOperationalSolutionCollectionByNeedTypeSQL string

//go:embed SQL/possible_operational_solution/collection_get_all.sql
var possibleOperationalSolutionCollectionGelAllSQL string

//go:embed SQL/possible_operational_solution/collection_get_by_operational_need_id.sql
var possibleOperationalSolutionCollectionByOperationalNeedIDSQL string

//go:embed SQL/possible_operational_solution/get_by_id.sql
var possibleOperationalSolutionGetByIDSQL string

//go:embed SQL/possible_operational_solution/get_by_key.sql
var possibleOperationalSolutionGetByKeySQL string

//go:embed SQL/possible_operational_solution/get_by_keys.sql
var possibleOperationalSolutionGetByKeysSQL string

type possibleOperationalSolutionScripts struct {
	CollectionByNeedType        string
	CollectionGetAll            string
	CollectionByOperationalNeed string
	GetByID                     string
	GetByKey                    string
	GetByKeys                   string
}

// PossibleOperationalSolution houses all the sql for getting data for possible operational solution from the database
var PossibleOperationalSolution = possibleOperationalSolutionScripts{
	CollectionByNeedType:        possibleOperationalSolutionCollectionByNeedTypeSQL,
	CollectionGetAll:            possibleOperationalSolutionCollectionGelAllSQL,
	CollectionByOperationalNeed: possibleOperationalSolutionCollectionByOperationalNeedIDSQL,
	GetByID:                     possibleOperationalSolutionGetByIDSQL,
	GetByKey:                    possibleOperationalSolutionGetByKeySQL,
	GetByKeys:                   possibleOperationalSolutionGetByKeysSQL,
}
