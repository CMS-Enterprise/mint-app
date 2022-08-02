package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
)

// BaseStructPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
func BaseStructPreUpdate(bs models.IBaseStruct, changes map[string]interface{}, principal string) error {
	section := bs.GetBaseStruct()

	section.ModifiedBy = &principal

	err := ApplyChanges(changes, bs)
	if err != nil {
		return err
	}

	return nil

}
