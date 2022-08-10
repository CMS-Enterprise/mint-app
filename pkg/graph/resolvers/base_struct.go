package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
)

// BaseStructPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
func BaseStructPreUpdate(bs models.IBaseStruct, changes map[string]interface{}, principal authentication.Principal) error {
	section := bs.GetBaseStruct()

	modified := principal.ID()

	section.ModifiedBy = &modified

	err := ApplyChanges(changes, bs)
	if err != nil {
		return err
	}

	return nil

}
