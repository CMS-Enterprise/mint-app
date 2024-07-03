package sqlqueries

import _ "embed"

//go:embed SQL/tag/create.sql
var tagCreateSQL string

//go:embed SQL/tag/create_collection.sql
var tagCreateCollectionSQL string

//go:embed SQL/tag/get_by_table_field_and_content_id.sql
var tagGetByTableFieldAndContentIDSQL string

type tagScripts struct {
	Create                    string
	CreateCollection          string
	GetByTableFieldAndContent string
}

// Tag houses all the sql for getting data for tag from the database
var Tag = tagScripts{
	Create:                    tagCreateSQL,
	CreateCollection:          tagCreateCollectionSQL,
	GetByTableFieldAndContent: tagGetByTableFieldAndContentIDSQL,
}
