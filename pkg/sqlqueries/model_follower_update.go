package sqlqueries

import _ "embed"

//go:embed SQL/model_follower_update/create.sql
var modelFollowerUpdateCreateSQL string

// ModelFollowerUpdate holds all relevant SQL scripts for model follower updates
var ModelFollowerUpdate = modelFollowerUpdateScripts{
	Create: modelFollowerUpdateCreateSQL,
}

type modelFollowerUpdateScripts struct {
	// Inserts a new model follower update message
	Create string
}
