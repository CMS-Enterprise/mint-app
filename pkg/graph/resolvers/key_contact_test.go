package resolvers

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
	"github.com/cms-enterprise/mint-app/pkg/userhelpers"
)

// TestCreateKeyContactUser validates creating a user contact for key contact.
func (suite *ResolverSuite) TestCreateKeyContactUser() {
	categoryName := "Test Category"
	newCategory, err := CreateKeyContactCategory(
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		categoryName,
	)
	suite.NoError(err)

	userName := "John Doe"
	subjectArea := "Healthcare"
	subjectCategoryID := newCategory.ID

	contact, err := CreateKeyContactUser(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		userName,
		subjectArea,
		subjectCategoryID,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
	)

	suite.NoError(err)
	suite.NotNil(contact)
	if suite.NotNil(contact.UserID) {
		userAccount, err := userhelpers.UserAccountGetByIDLOADER(suite.testConfigs.Context, *contact.UserID)
		suite.NoError(err)
		if suite.NotNil(userAccount.Username) {
			suite.Equal(userName, *userAccount.Username)
		}
	}
	suite.Equal(subjectArea, contact.SubjectArea)
	suite.Equal(subjectCategoryID, contact.SubjectCategoryID)
}

// TestCreateKeyContactMailbox validates creating a mailbox contact for key contact.
func (suite *ResolverSuite) TestCreateKeyContactMailbox() {
	categoryName := "Test Category"
	newCategory, err := CreateKeyContactCategory(
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		categoryName,
	)
	suite.NoError(err)

	mailboxTitle := "Support Team"
	mailboxAddress := "support@example.com"
	subjectArea := "Healthcare"
	subjectCategoryID := newCategory.ID

	contact, err := CreateKeyContactMailbox(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		mailboxTitle,
		mailboxAddress,
		subjectArea,
		subjectCategoryID,
	)

	suite.NoError(err)
	suite.NotNil(contact)
	if suite.NotNil(contact.Name) {
		suite.Equal(mailboxTitle, *contact.Name)
	}
	if suite.NotNil(contact.Email) {
		suite.Equal(mailboxAddress, *contact.Email)
	}
	suite.Equal(subjectArea, contact.SubjectArea)
	suite.Equal(subjectCategoryID, contact.SubjectCategoryID)
}

// TestGetKeyContactByIDLOADER validates fetching a key contact by its ID using the loader.
func (suite *ResolverSuite) TestGetKeyContactByIDLOADER() {
	categoryName := "Test Category"
	newCategory, err := CreateKeyContactCategory(
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		categoryName,
	)
	suite.NoError(err)

	// Create multiple mailbox contacts using the existing method
	mailboxTitle := "Support Team"
	subjectArea := "Healthcare"
	subjectCategoryID := newCategory.ID
	var keyContact *models.KeyContact

	expectedResults := []loaders.KeyAndExpected[uuid.UUID, *models.KeyContact]{}

	for i := 0; i < 4; i++ {
		mailboxAddress := fmt.Sprintf("support%d@example.com", i) // Ensure unique mailboxAddress
		keyContact, err = CreateKeyContactMailbox(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			nil,
			email.AddressBook{},
			mailboxTitle,
			mailboxAddress,
			subjectArea,
			subjectCategoryID,
		)
		suite.NoError(err)
		suite.NotNil(keyContact)
		if suite.NotNil(keyContact.Name) {
			suite.Equal(mailboxTitle, *keyContact.Name)
		}
		// add the contact to the array of expected results
		expectedResults = append(expectedResults, loaders.KeyAndExpected[uuid.UUID, *models.KeyContact]{
			Key:      keyContact.ID,
			Expected: keyContact,
		})
	}
	// Verify the loader can fetch the contact by ID
	verifyFunc := func(data *models.KeyContact, expected *models.KeyContact) bool {
		return suite.Equal(expected.MailboxAddress, data.MailboxAddress) &&
			suite.Equal(expected.ID, data.ID)
	}

	// Call the helper method to validate all results
	loaders.VerifyLoaders[uuid.UUID, *models.KeyContact, *models.KeyContact](
		suite.testConfigs.Context,
		&suite.Suite,
		loaders.KeyContact.ByID,
		expectedResults,
		verifyFunc,
	)
}

// GetAllKeyContactsLoaderTest validates the underlying behavior of the data loader. It validates the count of users that are returned for each solution.
func (suite *ResolverSuite) TestGetAllKeyContactsLoader() {
	categoryName := "Test Category"
	newCategory, err := CreateKeyContactCategory(
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		categoryName,
	)
	suite.NoError(err)

	// Create multiple mailbox contacts using the existing method
	mailboxTitle := "Support Team"
	subjectArea := "Healthcare"
	subjectCategoryID := newCategory.ID

	for i := 0; i < 5; i++ {
		mailboxAddress := fmt.Sprintf("support%d@example.com", i) // Ensure unique mailboxAddress
		_, err := CreateKeyContactMailbox(
			suite.testConfigs.Context,
			suite.testConfigs.Logger,
			suite.testConfigs.Principal,
			suite.testConfigs.Store,
			nil,
			nil,
			email.AddressBook{},
			mailboxTitle,
			mailboxAddress,
			subjectArea,
			subjectCategoryID,
		)
		suite.NoError(err)
	}

	// Verify the expected returned count of contacts
	expectedResults := []loaders.KeyAndExpected[*uuid.UUID, int]{
		{Key: &uuid.Nil, Expected: 5},
	}

	verifyFunc := func(data []*models.KeyContact, expected int) bool {
		return suite.Len(data, expected)
	}

	// Call the helper method to validate all results
	loaders.VerifyLoaders[*uuid.UUID, []*models.KeyContact, int](
		suite.testConfigs.Context,
		&suite.Suite,
		loaders.KeyContact.GetAll,
		expectedResults,
		verifyFunc,
	)
}

// TestUpdateKeyContact validates updating a key contact.
func (suite *ResolverSuite) TestUpdateKeyContact() {
	categoryName := "Test Category"
	newCategory, err := CreateKeyContactCategory(
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		categoryName,
	)
	suite.NoError(err)

	// Create a mailbox contact to update
	mailboxTitle := "Support Team"
	mailboxAddress := "support@example.com"
	subjectArea := "Healthcare"
	subjectCategoryID := newCategory.ID

	contact, err := CreateKeyContactMailbox(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		mailboxTitle,
		mailboxAddress,
		subjectArea,
		subjectCategoryID,
	)

	suite.NoError(err)
	suite.NotNil(contact)

	// Update the contact
	newSubjectArea := "Updated Area"
	updatedContact, err := UpdateKeyContact(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		contact.ID,
		map[string]interface{}{
			"subjectArea": newSubjectArea,
		},
	)
	suite.NoError(err)
	suite.NotNil(updatedContact)
	suite.Equal(newSubjectArea, updatedContact.SubjectArea)
}

// TestDeleteKeyContact validates deleting a key contact.
func (suite *ResolverSuite) TestDeleteKeyContact() {
	categoryName := "Test Category"
	newCategory, err := CreateKeyContactCategory(
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		categoryName,
	)
	suite.NoError(err)

	// Create a key contact to delete
	userName := "John Doe"
	subjectArea := "Healthcare"
	subjectCategoryID := newCategory.ID

	contact, err := CreateKeyContactUser(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		nil,
		nil,
		email.AddressBook{},
		userName,
		subjectArea,
		subjectCategoryID,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
	)
	suite.NoError(err)
	suite.NotNil(contact)

	// Delete the key contact
	deletedContact, err := DeleteKeyContact(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		contact.ID,
	)
	suite.NoError(err)
	suite.NotNil(deletedContact)
	suite.Equal(contact.ID, deletedContact.ID)

	// Verify the key contact no longer exists
	fetchedContact, err := GetKeyContact(
		suite.testConfigs.Context,
		contact.ID,
	)
	suite.Error(err)
	suite.Nil(fetchedContact)
}
