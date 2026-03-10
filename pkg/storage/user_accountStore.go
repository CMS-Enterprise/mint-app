package storage

import (
	_ "embed"
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// UserAccountGetByUsername gets a user account by a give username
func UserAccountGetByUsername(np sqlutils.NamedPreparer, username string) (*authentication.UserAccount, error) {
	user := &authentication.UserAccount{}

	stmt, err := np.PrepareNamed(sqlqueries.UserAccount.GetByUsername)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"username": username,
	}

	err = stmt.Get(user, arg)
	if err != nil {
		if err.Error() == "sql: no rows in result set" { //EXPECT THERE TO BE NULL results, don't treat this as an error
			return nil, nil
		}
		return nil, err
	}

	return user, nil
}

// UserAccountGetByID gets a User account from the database by its internal id.
func UserAccountGetByID(np sqlutils.NamedPreparer, id uuid.UUID) (*authentication.UserAccount, error) {
	user := &authentication.UserAccount{}

	stmt, err := np.PrepareNamed(sqlqueries.UserAccount.GetByID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"id": id,
	}

	err = stmt.Get(user, arg)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// UserAccountGetByIDLOADER gets multiple User account from the database by its internal id.
func (s *Store) UserAccountGetByIDLOADER(
	_ *zap.Logger,
	paramTableJSON string,
) ([]*authentication.UserAccount, error) {

	var userSlice []*authentication.UserAccount

	stmt, err := s.db.PrepareNamed(sqlqueries.UserAccount.GetByIDLOADER)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	err = stmt.Select(&userSlice, arg)
	if err != nil {
		return nil, err
	}

	return userSlice, nil
}

// UserAccountNotificationPreferencesNewModelPlan gets the notification
// preferences for a new model plan for a slice of users who have at least one
// enabled preference
func (s *Store) UserAccountNotificationPreferencesNewModelPlan(np sqlutils.NamedPreparer) (
	[]*models.UserAccountAndNotificationPreferences,
	error,
) {

	var results []*models.UserAccountAndNotificationPreferences

	stmt, err := np.PrepareNamed(sqlqueries.UserAccount.GetNotificationPreferencesNewModelPlan)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Select(&results, map[string]interface{}{})
	if err != nil {
		return nil, err
	}

	return results, nil
}

// UserAccountInsertByUsername creates a new user account for a given username
func UserAccountInsertByUsername(np sqlutils.NamedPreparer, userAccount *authentication.UserAccount) (*authentication.UserAccount, error) {

	user := &authentication.UserAccount{}
	if userAccount.ID == uuid.Nil {
		userAccount.ID = uuid.New()
	}

	stmt, err := np.PrepareNamed(sqlqueries.UserAccount.InsertByUsername)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(user, userAccount)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// UserAccountUpdateByUserName updates an existing user account for a given username
func UserAccountUpdateByUserName(np sqlutils.NamedPreparer, userAccount *authentication.UserAccount) (
	*authentication.UserAccount,
	error,
) {

	user := &authentication.UserAccount{}
	if userAccount.ID == uuid.Nil {
		userAccount.ID = uuid.New()
	}

	stmt, err := np.PrepareNamed(sqlqueries.UserAccount.UpdateByUsername)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	err = stmt.Get(user, userAccount)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// UserAccountsGetNotificationRecipientsForDatesChanged returns a collection of
// user accounts that should be notified of a change in model plan dates
func (s *Store) UserAccountsGetNotificationRecipientsForDatesChanged(
	modelPlanID uuid.UUID,
) (
	[]*models.UserAccountAndNotificationPreferences,
	error,
) {
	var recipients []*models.UserAccountAndNotificationPreferences

	stmt, err := s.db.PrepareNamed(sqlqueries.UserAccount.GetNotificationRecipientsDatesChanged)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := utilitysql.CreateModelPlanIDQueryMap(modelPlanID)

	err = stmt.Select(&recipients, arg)
	if err != nil {
		return nil, err
	}

	return recipients, nil
}

// UserAccountGetNotificationPreferencesForDataExchangeApproachMarkedComplete returns a collection of
// user accounts that should be notified of when a data exchange approach is marked complete
func UserAccountGetNotificationPreferencesForDataExchangeApproachMarkedComplete(
	np sqlutils.NamedPreparer,
	modelPlanID uuid.UUID,
) ([]*models.UserAccountAndNotificationPreferences, error) {
	arg := utilitysql.CreateModelPlanIDQueryMap(modelPlanID)
	return sqlutils.SelectProcedure[models.UserAccountAndNotificationPreferences](np, sqlqueries.UserAccount.GetNotificationPreferencesDataExchangeApproachMarkedComplete, arg)
}

// UserAccountsGetNotificationRecipientsForDiscussionAdded returns a collection of
// user accounts that should be notified of when a new discussion is added to a model plan
func (s *Store) UserAccountsGetNotificationRecipientsForDiscussionAdded(
	np sqlutils.NamedPreparer,
	modelPlanID uuid.UUID,
) (
	[]*models.UserAccountAndNotificationPreferences,
	error,
) {
	arg := utilitysql.CreateModelPlanIDQueryMap(modelPlanID)
	return sqlutils.SelectProcedure[models.UserAccountAndNotificationPreferences](np, sqlqueries.UserAccount.GetNotificationPreferencesDiscussionAdded, arg)
}

// UserAccountGetNotificationPreferencesForIDDOCQuestionnaireCompleted returns a collection of
// user accounts that should be notified of when an IDDOC questionnaire is completed
func UserAccountGetNotificationPreferencesForIDDOCQuestionnaireCompleted(
	np sqlutils.NamedPreparer,
	modelPlanID uuid.UUID,
) ([]*models.UserAccountAndNotificationPreferences, error) {
	arg := utilitysql.CreateModelPlanIDQueryMap(modelPlanID)
	return sqlutils.SelectProcedure[models.UserAccountAndNotificationPreferences](np, sqlqueries.UserAccount.GetNotificationPreferencesIDDOCQuestionnaireCompleted, arg)
}

// UserAccountsGetNotificationRecipientsForIDDOCQuestionnaireCompleted returns a collection of
// user accounts that should be notified of when an IDDOC questionnaire is completed
func (s *Store) UserAccountsGetNotificationRecipientsForIDDOCQuestionnaireCompleted(
	np sqlutils.NamedPreparer,
	modelPlanID uuid.UUID,
) ([]*models.UserAccountAndNotificationPreferences, error) {
	arg := utilitysql.CreateModelPlanIDQueryMap(modelPlanID)
	return sqlutils.SelectProcedure[models.UserAccountAndNotificationPreferences](np, sqlqueries.UserAccount.GetNotificationPreferencesIDDOCQuestionnaireCompleted, arg)
}

// UserAccountGetLeadModelPlanCount returns the count of model plans where the user is a lead.
func UserAccountGetLeadModelPlanCount(np sqlutils.NamedPreparer, userID uuid.UUID) (int, error) {
	arg := map[string]interface{}{
		"user_id": userID,
	}
	count, err := sqlutils.GetProcedure[int](np, sqlqueries.UserAccount.GetLeadModelPlanCount, arg)
	if err != nil {
		return 0, err
	}
	if count == nil {
		return 0, fmt.Errorf("unexpected nil pointer for count")
	}
	return *count, nil
}
