package sqlqueries

import (
	_ "embed"
)

//go:embed SQL/utility/set_session_current_user.sql
var setSessionCurrentUserSQL string

type utilityScripts struct {
	SetSessionCurrentUser string
}

// Utility houses all the sql for utility from the database
var Utility = utilityScripts{
	SetSessionCurrentUser: setSessionCurrentUserSQL,
}
