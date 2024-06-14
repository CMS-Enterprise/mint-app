package models

import (
	"database/sql/driver"
	"strings"

	"github.com/davecgh/go-spew/spew"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"github.com/samber/lo"

	"github.com/cmsgov/mint-app/pkg/serialization"
)

type ViewCustomizationType string

const (
	ViewCustomizationTypeMyModelPlans                ViewCustomizationType = "MY_MODEL_PLANS"
	ViewCustomizationTypeAllModelPlans               ViewCustomizationType = "ALL_MODEL_PLANS"
	ViewCustomizationTypeFollowedModels              ViewCustomizationType = "FOLLOWED_MODELS"
	ViewCustomizationTypeModelsWithCrTdl             ViewCustomizationType = "MODELS_WITH_CR_TDL"
	ViewCustomizationTypeModelsByOperationalSolution ViewCustomizationType = "MODELS_BY_OPERATIONAL_SOLUTION"
)

type UUIDArray []uuid.UUID

// Scan implements the scanner interface so we can translate the JSONb from the db to an object in GO
func (ua *UUIDArray) Scan(src interface{}) error {
	println("=============================")
	println("UUIDArray.Scan")
	println("=============================")
	println("Source:")
	spew.Dump(src)
	println("=============================")

	var strArr []string
	err := serialization.GenericStringArrayScan(src, &strArr)
	if err != nil {
		return err
	}

	// Resize ua to match the length of strArr
	*ua = make([]uuid.UUID, len(strArr))

	// Parse each string in strArr to a UUID and store it in ua
	for i, s := range strArr {
		u, err := uuid.Parse(strings.TrimSpace(s))
		if err != nil {
			return err
		}
		(*ua)[i] = u
	}

	return nil
}

func (ua *UUIDArray) Value() (driver.Value, error) {
	println("=============================")
	println("UUIDArray.Value")
	println("=============================")
	println("Value:")
	spew.Dump(ua)
	println("=============================")

	// Convert the UUID array to a string array
	strArr := lo.Map(*ua, func(u uuid.UUID, _ int) string {
		return u.String()
	})

	return serialization.GenericStringArrayValue(strArr)
}

type UserViewCustomization struct {
	baseStruct
	UserID                       uuid.UUID      `json:"userId" db:"user_id"`
	ViewCustomization            pq.StringArray `json:"viewCustomization" db:"view_customization"`
	PossibleOperationalSolutions pq.StringArray `json:"possibleOperationalSolutions" db:"possible_operational_solutions"`
}
