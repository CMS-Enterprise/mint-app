package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/models"
)

// BaseTaskListSectionPreUpdate applies incoming changes from to a TaskList Section, and validates it's status
func BaseTaskListSectionPreUpdate(tls models.IBaseTaskListSection, changes map[string]interface{}, principal string) error {
	section := tls.GetBaseTaskListSection()

	section.ModifiedBy = &principal

	oldStatus := section.Status

	err := ApplyChanges(changes, tls)
	if err != nil {
		return err
	}

	err = tls.CalcStatus(oldStatus)
	if err != nil {
		return err
	}

	return nil

}
