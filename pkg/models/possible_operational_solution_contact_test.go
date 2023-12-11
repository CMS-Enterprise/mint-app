package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetPOCEmailAddresses(t *testing.T) {

	devEmail := "dev@dev.com"
	pocs := []*PossibleOperationalSolutionContact{
		{Name: "Test1", Email: "test1email@email.com"},
		{Name: "Test2", Email: "test2email@email.com"},
	}
	t.Run("Send to tagged POCs returns POC emails", func(t *testing.T) {
		pocEmail, err := GetPOCEmailAddresses(pocs, true, devEmail)
		assert.NoError(t, err)
		assert.Len(t, pocEmail, 2)
		assert.EqualValues(t, pocEmail[0], pocs[0].Email)
		assert.EqualValues(t, pocEmail[1], pocs[1].Email)

	})
	t.Run("Send to tagged POCs false, returns dev email POC email simulation", func(t *testing.T) {
		pocEmail, err := GetPOCEmailAddresses(pocs, false, devEmail)
		assert.NoError(t, err)
		assert.Len(t, pocEmail, 2)
		assert.NotEqualValues(t, pocEmail[0], pocs[0].Email)
		assert.NotEqualValues(t, pocEmail[1], pocs[1].Email)
		assert.EqualValues(t, pocEmail[0], "dev+Test1@dev.com")
		assert.EqualValues(t, pocEmail[1], "dev+Test2@dev.com")

	})

	t.Run("Malformed email addresses cause an error", func(t *testing.T) {
		pocEmail, err := GetPOCEmailAddresses(pocs, false, "bad email address")
		assert.Error(t, err)
		assert.Len(t, pocEmail, 0)
	})

}
