package sqlqueries

import _ "embed"

//go:embed SQL/key_contact_directory/key_contact/get_all.sql
var keyContactGetAll string

//go:embed SQL/key_contact_directory/key_contact/get_by_id.sql
var keyContactGetByID string

//go:embed SQL/key_contact_directory/key_contact/get_by_ids.sql
var keyContactGetByIDs string

//go:embed SQL/key_contact_directory/key_contact/get_by_category_ids.sql
var keyContactGetByCategoryIDs string

//go:embed SQL/key_contact_directory/key_contact/create.sql
var keyContactCreate string

//go:embed SQL/key_contact_directory/key_contact/update.sql
var keyContactUpdate string

//go:embed SQL/key_contact_directory/key_contact/delete.sql
var keyContactDeleteByID string

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
	GetAll:           keyContactGetAll,
	GetByID:          keyContactGetByID,
	GetByIDs:         keyContactGetByIDs,
	GetByCategoryIDs: keyContactGetByCategoryIDs,
	Create:           keyContactCreate,
	Update:           keyContactUpdate,
	DeleteByID:       keyContactDeleteByID,
}
