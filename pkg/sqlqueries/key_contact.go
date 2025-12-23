package sqlqueries

import _ "embed"

//go:embed SQL/key_contact_directory/key_contact/get_all.sql
var KeyContactGetAll string

//go:embed SQL/key_contact_directory/key_contact/get_by_id.sql
var KeyContactGetByID string

//go:embed SQL/key_contact_directory/key_contact/get_by_ids.sql
var KeyContactGetByIDs string

//go:embed SQL/key_contact_directory/key_contact/get_by_category_ids.sql
var KeyContactGetByCategoryIDs string

//go:embed SQL/key_contact_directory/key_contact/create.sql
var KeyContactCreate string

//go:embed SQL/key_contact_directory/key_contact/update.sql
var KeyContactUpdate string

//go:embed SQL/key_contact_directory/key_contact/delete.sql
var KeyContactDeleteByID string

type KeyContactScripts struct {
	GetAll           string
	GetByID          string
	GetByIDs         string
	GetByCategoryIDs string
	Create           string
	Update           string
	DeleteByID       string
}

// KeyContact houses all the sql for getting data for key contact from the database
var KeyContact = KeyContactScripts{
	GetAll:           KeyContactGetAll,
	GetByID:          KeyContactGetByID,
	GetByIDs:         KeyContactGetByIDs,
	GetByCategoryIDs: KeyContactGetByCategoryIDs,
	Create:           KeyContactCreate,
	Update:           KeyContactUpdate,
	DeleteByID:       KeyContactDeleteByID,
}
