package storage

import (
	_ "embed"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"

	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
)

// setCurrentSessionUserVariable sets the userID for a scope of a transaction.
// This session variable is then used for determining who deleted a record in the audit trigger.
func setCurrentSessionUserVariable(tx *sqlx.Tx, userID uuid.UUID) error {
	argsUser := utilitySQL.CreateUserIDQueryMap(userID)

	_, err := tx.NamedExec(sqlqueries.Utility.SetSessionCurrentUser, argsUser)
	if err != nil {
		return err
	}
	return nil
}

func convertIntToPQStringArray(intArray []int) pq.StringArray {

	stringArray := pq.StringArray{}

	for i := 0; i < len(intArray); i++ {

		stringArray = append(stringArray, fmt.Sprint(intArray[i]))
	}
	return stringArray

}
