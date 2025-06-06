package resolvers

import (
	"testing"

	"github.com/stretchr/testify/suite"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// Test creating a user contact
func (suite *ResolverSuite) TestCreateMTOCommonSolutionUserContactUser() {
	key := models.MTOCSKInnovation
	userName := suite.testConfigs.UserInfo.Username // Use seeded user
	isTeam := false
	role := stringPointer("Lead")
	receiveEmails := true
	isPrimary := true

	contact, err := CreateMTOCommonSolutionUserContactUser(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		key,
		userName,
		isTeam,
		role,
		receiveEmails,
		isPrimary,
	)

	suite.NoError(err)
	suite.NotNil(contact)
	suite.Equal(userName, contact.UserAccount.Username)
	suite.Equal(key, contact.Key)
}

// Test creating a mailbox contact
func (suite *ResolverSuite) TestCreateMTOCommonSolutionContactMailbox() {
	key := models.MTOCSKInnovation
	mailboxTitle := stringPointer("Support Team")
	mailboxAddress := "support@example.com"
	isTeam := true
	role := stringPointer("Support")
	receiveEmails := true
	isPrimary := false

	contact, err := CreateMTOCommonSolutionContactMailbox(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		key,
		mailboxTitle,
		mailboxAddress,
		isTeam,
		role,
		receiveEmails,
		isPrimary,
	)

	suite.NoError(err)
	suite.NotNil(contact)
	suite.Equal(mailboxAddress, contact.MailboxAddress)
	suite.Equal(key, contact.Key)
}

// Test updating a contact
func (suite *ResolverSuite) TestUpdateMTOCommonSolutionUserContact() {
	// First, create a contact to update
	key := models.MTOCSKInnovation
	userName := suite.testConfigs.UserInfo.Username
	contact, _ := CreateMTOCommonSolutionUserContactUser(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		key,
		userName,
		false,
		stringPointer("Lead"),
		true,
		true,
	)

	changes := map[string]interface{}{
		"role":          "UpdatedRole",
		"isPrimary":     false,
		"receiveEmails": false,
	}

	updated, err := UpdateMTOCommonSolutionUserContact(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		contact.ID,
		changes,
	)

	suite.NoError(err)
	suite.NotNil(updated)
	suite.Equal("UpdatedRole", *updated.Role)
	suite.False(updated.IsPrimary)
	suite.False(updated.ReceiveEmails)
}

// Test deleting a contact
func (suite *ResolverSuite) TestDeleteMTOCommonSolutionUserContact() {
	// First, create a contact to delete
	key := models.MTOCSKInnovation
	userName := suite.testConfigs.UserInfo.Username
	contact, _ := CreateMTOCommonSolutionUserContactUser(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		key,
		userName,
		false,
		stringPointer("Lead"),
		true,
		true,
	)

	deleted, err := DeleteMTOCommonSolutionUserContact(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		contact.ID,
	)

	suite.NoError(err)
	suite.NotNil(deleted)
	suite.Equal(contact.ID, deleted.ID)
}

// Test getting a contact by ID
func (suite *ResolverSuite) TestGetMTOCommonSolutionUserContact() {
	// First, create a contact to fetch
	key := models.MTOCSKInnovation
	userName := suite.testConfigs.UserInfo.Username
	contact, _ := CreateMTOCommonSolutionUserContactUser(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		key,
		userName,
		false,
		stringPointer("Lead"),
		true,
		true,
	)

	fetched, err := GetMTOCommonSolutionUserContact(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		contact.ID,
	)

	suite.NoError(err)
	suite.NotNil(fetched)
	suite.Equal(contact.ID, fetched.ID)
}

// Helper for pointer to string
func stringPointer(s string) *string { return &s }

// Register the test suite
func TestMTOCommonSolutionContactSuite(t *testing.T) {
	suite.Run(t, new(ResolverSuite))
}
