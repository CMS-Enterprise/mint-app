package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
)

// BaseTaskListSectionPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
func BaseTaskListSectionPreUpdate(btls models.IBaseTaskListSection, changes map[string]interface{}, principal string) error {
	section := btls.GetBaseTaskListSection()

	section.ModifiedBy = &principal

	oldStatus := section.Status

	err := ApplyChanges(changes, btls)
	if err != nil {
		return err
	}

	err = section.CalcStatus(oldStatus)
	if err != nil {
		return err
	}

	return nil

}
