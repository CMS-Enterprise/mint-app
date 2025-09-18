package sqlqueries

import _ "embed"

//go:embed SQL/mto/note/create.sql
var mtoMilestoneNoteCreateSQL string

//go:embed SQL/mto/note/update.sql
var mtoMilestoneNoteUpdateSQL string

//go:embed SQL/mto/note/delete.sql
var mtoMilestoneNoteDeleteSQL string

//go:embed SQL/mto/note/get_by_milestone_id_LOADER.sql
var mtoMilestoneNoteGetByMilestoneIDLoaderSQL string

var MTOMilestoneNote = mtoMilestoneNoteScripts{
	Create:                 mtoMilestoneNoteCreateSQL,
	Update:                 mtoMilestoneNoteUpdateSQL,
	Delete:                 mtoMilestoneNoteDeleteSQL,
	GetByMilestoneIDLoader: mtoMilestoneNoteGetByMilestoneIDLoaderSQL,
}

type mtoMilestoneNoteScripts struct {
	Create                 string
	Update                 string
	Delete                 string
	GetByMilestoneIDLoader string
}
