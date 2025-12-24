package sqlqueries

import _ "embed"

//go:embed SQL/key_contact_directory/key_contact_category/create.sql
var keyContactCategoryCreateSQL string

//go:embed SQL/key_contact_directory/key_contact_category/delete.sql
var keyContactCategoryDeleteSQL string

//go:embed SQL/key_contact_directory/key_contact_category/update.sql
var keyContactCategoryUpdateSQL string

//go:embed SQL/key_contact_directory/key_contact_category/get_by_id.sql
var keyContactCategoryGetByIDSQL string

//go:embed SQL/key_contact_directory/key_contact_category/get_by_ids.sql
var keyContactCategoryGetByIDsSQL string

//go:embed SQL/key_contact_directory/key_contact_category/get_all.sql
var keyContactCategoryGetAllSQL string

type keyContactCategoryScripts struct {
	Create   string
	Delete   string
	Update   string
	GetByID  string
	GetByIDs string
	GetAll   string
}

// KeyContactCategory houses all the sql for getting data for key contact category from the database
var KeyContactCategory = keyContactCategoryScripts{
	Create:   keyContactCategoryCreateSQL,
	Delete:   keyContactCategoryDeleteSQL,
	Update:   keyContactCategoryUpdateSQL,
	GetByID:  keyContactCategoryGetByIDSQL,
	GetByIDs: keyContactCategoryGetByIDsSQL,
	GetAll:   keyContactCategoryGetAllSQL,
}
