package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGQLTableName(t *testing.T) {

	ctr := ChangeTableRecord{
		TableName: "plan_basics",
	}

	enum := ctr.GQLTableName()
	assert.Equal(t, GQTNPlanbasics, enum)

	ctr.TableName = "Hello"
	enum = ctr.GQLTableName()
	assert.Equal(t, GQLTableName("UNKNOWN"), enum)

}
