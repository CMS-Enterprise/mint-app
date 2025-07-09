package resolvers

import (
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

// TestCreateMTOCommonSolutionContactUser validates creating a user contact for a common solution.
func (suite *ResolverSuite) TestCreateMTOCommonSolutionContactUser() {
	userName := "John Doe"
	isTeam := false
	role := "Team Lead"
	receiveEmails := true
	isPrimary := true

	contact, err := CreateMTOCommonSolutionContactUser(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		models.MTOCSKInnovation,
		userName,
		isTeam,
		&role,
		receiveEmails,
		isPrimary,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
	)
	suite.NoError(err)
	suite.NotNil(contact)
	suite.Equal(role, *contact.Role)
	suite.Equal(models.MTOCSKInnovation, contact.Key)
	suite.False(contact.IsTeam)
	suite.True(contact.IsPrimary)
	suite.True(contact.ReceiveEmails)
	suite.Equal(role, *contact.Role)
}

// TestMTOCommonSolutionGetByModelPlanIDLOADER validates fetching contacts by model plan ID using the loader.
func (suite *ResolverSuite) TestMTOCommonSolutionGetByModelPlanIDLOADER() {
	// Create a mailbox contact using the existing method
	mailboxTitle := "Support Team"
	mailboxAddress := "support@example.com"
	isTeam := true
	receiveEmails := true
	isPrimary := true

	// Role must be nil for mailbox contacts
	var role *string = nil

	_, err := CreateMTOCommonSolutionContactMailbox(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		models.MTOCSKInnovation,
		&mailboxTitle,
		mailboxAddress,
		isTeam,
		role, // Role is nil
		receiveEmails,
		isPrimary,
	)
	suite.NoError(err)

	// Fetch contacts using the loader
	commonSolutionKey := models.MTOCSKInnovation
	contacts, err := MTOCommonSolutionContactInformationGetByKeyLOADER(suite.testConfigs.Context, commonSolutionKey)

	suite.NoError(err)
	suite.NotNil(contacts)
	suite.Len(contacts.PointsOfContact, 1)

	primary, err := contacts.PrimaryContact()
	suite.NoError(err)
	suite.NotNil(primary)
	suite.Equal(mailboxTitle, primary.Name)
}

// MTOMCommonSolutionContactLoaderTest validates the underlying behavior of the data loader. It validates the count of users that are returned for each solution.
func (suite *ResolverSuite) TestMTOMCommonSolutionContactLoader() {
	// Create multiple mailbox contacts using the existing method
	mailboxTitle := "Support Team"
	isTeam := true
	receiveEmails := true
	isPrimary := true

	// Role must be nil for mailbox contacts
	var role *string = nil

	for i := 0; i < 5; i++ {
		mailboxAddress := fmt.Sprintf("support%d@example.com", i) // Ensure unique mailboxAddress
		_, err := CreateMTOCommonSolutionContactMailbox(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			nil,
			email.AddressBook{},
			models.MTOCSKInnovation,
			&mailboxTitle,
			mailboxAddress,
			isTeam,
			role, // Role is nil
			receiveEmails,
			isPrimary,
		)
		suite.NoError(err)
	}

	// Verify the expected returned count of contacts
	expectedResults := []loaders.KeyAndExpected[models.MTOCommonSolutionKey, int]{
		{Key: models.MTOCSKInnovation, Expected: 5},
	}

	verifyFunc := func(data []*models.MTOCommonSolutionContact, expected int) bool {
		return suite.Len(data, expected)
	}

	// Call the helper method to validate all results
	loaders.VerifyLoaders[models.MTOCommonSolutionKey, []*models.MTOCommonSolutionContact, int](
		suite.testConfigs.Context,
		&suite.Suite,
		loaders.MTOCommonSolutionContact.ByCommonSolutionKey,
		expectedResults,
		verifyFunc,
	)
}

// TestUpdateMTOCommonSolutionContact validates updating a common solution contact.
func (suite *ResolverSuite) TestUpdateMTOCommonSolutionContact() {
	// Create a mailbox contact to update
	mailboxTitle := "Support Team"
	mailboxAddress := "support@example.com"
	isTeam := true
	receiveEmails := true
	isPrimary := true

	contact, err := CreateMTOCommonSolutionContactMailbox(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		models.MTOCSKInnovation,
		&mailboxTitle,
		mailboxAddress,
		isTeam,
		nil,
		receiveEmails,
		isPrimary,
	)
	suite.NoError(err)
	suite.NotNil(contact)

	// Update the contact
	updatedTitle := "Updated Support Team"
	updatedReceiveEmails := false
	updatedContact, err := UpdateMTOCommonSolutionContact(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		contact.ID,
		map[string]interface{}{
			"mailboxTitle":  updatedTitle,
			"receiveEmails": updatedReceiveEmails,
		},
	)
	suite.NoError(err)
	suite.NotNil(updatedContact)
	suite.Equal(updatedTitle, *updatedContact.MailboxTitle)
	suite.Equal(updatedReceiveEmails, updatedContact.ReceiveEmails)
}
