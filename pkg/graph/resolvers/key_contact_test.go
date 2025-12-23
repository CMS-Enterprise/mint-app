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
func (suite *ResolverSuite) TestKeyContactsGetByCategoryIDLOADER() {
	categoryName1 := "Test Category1"
	cat1 := suite.createKeyContactCategory(categoryName1)
	contactCat1A := suite.createTestKeyContact("User A", "Area A", cat1.ID)
	contactCat1B := suite.createTestKeyContact("User B", "Area B", cat1.ID)

	categoryName2 := "Test Category2"
	cat2 := suite.createKeyContactCategory(categoryName2)
	contactCat2A := suite.createTestKeyContact("User C", "Area C", cat2.ID)
	contactCat2B := suite.createTestKeyContact("User D", "Area D", cat2.ID)

	categoryName3 := "Test Category3"
	cat3 := suite.createKeyContactCategory(categoryName3)
	contactCat3A := suite.createTestKeyContact("User E", "Area E", cat3.ID)
	contactCat3B := suite.createTestKeyContact("User F", "Area F", cat3.ID)
	contactCat3C := suite.createTestKeyContact("User G", "Area G", cat3.ID)

	categoryName4 := "Test Category4"
	cat4 := suite.createKeyContactCategory(categoryName4)
	// No contacts for category 4

	expectedResults := []loaders.KeyAndExpected[uuid.UUID, map[uuid.UUID]*models.KeyContact]{
		{
			Key:      cat1.ID,
			Expected: map[uuid.UUID]*models.KeyContact{contactCat1A.ID: contactCat1A, contactCat1B.ID: contactCat1B},
		},
		{
			Key:      cat2.ID,
			Expected: map[uuid.UUID]*models.KeyContact{contactCat2A.ID: contactCat2A, contactCat2B.ID: contactCat2B},
		},
		{
			Key:      cat3.ID,
			Expected: map[uuid.UUID]*models.KeyContact{contactCat3A.ID: contactCat3A, contactCat3B.ID: contactCat3B, contactCat3C.ID: contactCat3C},
		},
		{
			Key:      cat4.ID,
			Expected: map[uuid.UUID]*models.KeyContact{},
		},
	}

	verifyFunc := func(data []*models.KeyContact, expected map[uuid.UUID]*models.KeyContact) bool {
		// 1. verify lengths match
		if suite.Len(data, len(expected)) {

			for _, contact := range data {
				// 2. verify each contact matches expected
				expectedContact, exists := expected[contact.ID]
				if !exists {
					return false
				}
				if !suite.Equal(expectedContact.Name, contact.Name) {
					return false
				}
				if !suite.Equal(expectedContact.Email, contact.Email) {
					return false
				}
				if !suite.Equal(expectedContact.SubjectArea, contact.SubjectArea) {
					return false
				}
				if !suite.Equal(expectedContact.SubjectCategoryID, contact.SubjectCategoryID) {
					return false
				}
			}

			return true
		}
		return false
	}

	// Call the helper method to validate all results
	loaders.VerifyLoaders[uuid.UUID, []*models.KeyContact, map[uuid.UUID]*models.KeyContact](
		suite.testConfigs.Context,
		&suite.Suite,
		loaders.KeyContact.ByCategoryID,
		expectedResults,
		verifyFunc,
	)
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

// createTestKeyContact is a convenience helper function to simplify creating key contacts in tests.
func (suite *ResolverSuite) createTestKeyContact(userName string, subjectArea string, categoryID uuid.UUID) *models.KeyContact {
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
		categoryID,
		userhelpers.GetUserInfoAccountInfoWrapperFunc(suite.stubFetchUserInfo),
	)

	suite.NoError(err)
	suite.NotNil(contact)
	return contact

}
