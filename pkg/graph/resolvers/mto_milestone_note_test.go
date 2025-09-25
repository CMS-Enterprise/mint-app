package resolvers

import (
	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// TestMTOMilestoneNoteCreate tests creating a new MTO milestone note
func (suite *ResolverSuite) TestMTOMilestoneNoteCreate() {
	// Create model plan and milestone
	plan := suite.createModelPlan("Test Plan for MTO Milestone Notes")
	milestone := suite.createMilestoneCommon(plan.ID, models.MTOCommonMilestoneKeyManageCd, []models.MTOCommonSolutionKey{})

	// Test data
	content := "This is a test milestone note"

	// Create the note
	note, err := CreateMTOMilestoneNote(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		models.MTOMilestoneNoteCreateInput{
			Content:        content,
			MTOMilestoneID: milestone.ID,
		},
	)

	// Assertions
	suite.NoError(err)
	suite.NotNil(note)
	suite.NotEqual(uuid.Nil, note.ID) // Should have a generated UUID
	suite.Equal(content, note.Content)
	suite.Equal(milestone.ID, note.MTOMilestoneID)
	suite.Equal(suite.testConfigs.Principal.UserAccount.ID, note.CreatedBy)
	suite.NotNil(note.CreatedDts)
	suite.Nil(note.ModifiedBy)
	suite.Nil(note.ModifiedDts)
}

// TestMTOMilestoneNoteCreateWithEmptyContent tests that empty content is rejected
func (suite *ResolverSuite) TestMTOMilestoneNoteCreateWithEmptyContent() {
	plan := suite.createModelPlan("Test Plan for Empty Content Rejection")
	milestone := suite.createMilestoneCommon(plan.ID, models.MTOCommonMilestoneKeyManageCd, []models.MTOCommonSolutionKey{})

	note, err := CreateMTOMilestoneNote(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		models.MTOMilestoneNoteCreateInput{
			Content:        "", // Empty content should be rejected by ZERO_STRING constraint
			MTOMilestoneID: milestone.ID,
		},
	)

	suite.Error(err)
	suite.Nil(note)
	suite.Contains(err.Error(), "zero_string_check")
}

// TestMTOMilestoneNoteCreateWithInvalidMilestoneID tests creating a note with invalid milestone ID
func (suite *ResolverSuite) TestMTOMilestoneNoteCreateWithInvalidMilestoneID() {
	invalidMilestoneID := uuid.New()

	note, err := CreateMTOMilestoneNote(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		models.MTOMilestoneNoteCreateInput{
			Content:        "Test content",
			MTOMilestoneID: invalidMilestoneID,
		},
	)

	suite.Error(err)
	suite.Nil(note)
	suite.Contains(err.Error(), "failed to get milestone")
}

// TestMTOMilestoneNoteUpdate tests updating an existing MTO milestone note
func (suite *ResolverSuite) TestMTOMilestoneNoteUpdate() {
	// Create model plan, milestone, and note
	plan := suite.createModelPlan("Test Plan for MTO Milestone Note Update")
	milestone := suite.createMilestoneCommon(plan.ID, models.MTOCommonMilestoneKeyManageCd, []models.MTOCommonSolutionKey{})
	note := suite.createMTOMilestoneNote(milestone, "Original content")

	// Update the note
	newContent := "Updated content"
	updatedNote, err := UpdateMTOMilestoneNote(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		models.MTOMilestoneNoteUpdateInput{
			ID:      note.ID,
			Content: newContent,
		},
	)

	// Assertions
	suite.NoError(err)
	suite.NotNil(updatedNote)
	suite.Equal(note.ID, updatedNote.ID)
	suite.Equal(newContent, updatedNote.Content)
	suite.Equal(note.MTOMilestoneID, updatedNote.MTOMilestoneID)
	suite.Equal(note.CreatedBy, updatedNote.CreatedBy)
	suite.Equal(note.CreatedDts, updatedNote.CreatedDts)
	suite.NotNil(updatedNote.ModifiedBy)
	suite.Equal(suite.testConfigs.Principal.UserAccount.ID, *updatedNote.ModifiedBy)
	suite.NotNil(updatedNote.ModifiedDts)
}

// TestMTOMilestoneNoteUpdateWithInvalidID tests updating a note with invalid ID
func (suite *ResolverSuite) TestMTOMilestoneNoteUpdateWithInvalidID() {
	invalidID := uuid.New()

	updatedNote, err := UpdateMTOMilestoneNote(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		models.MTOMilestoneNoteUpdateInput{
			ID:      invalidID,
			Content: "Updated content",
		},
	)

	suite.Error(err)
	suite.Nil(updatedNote)
	suite.Contains(err.Error(), "unable to update MTO milestone note")
}

// TestMTOMilestoneNoteDelete tests deleting an existing MTO milestone note
func (suite *ResolverSuite) TestMTOMilestoneNoteDelete() {
	// Create model plan, milestone, and note
	plan := suite.createModelPlan("Test Plan for MTO Milestone Note Delete")
	milestone := suite.createMilestoneCommon(plan.ID, models.MTOCommonMilestoneKeyManageCd, []models.MTOCommonSolutionKey{})
	note := suite.createMTOMilestoneNote(milestone, "Content to be deleted")

	// Delete the note
	err := DeleteMTOMilestoneNote(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		note.ID,
	)

	// Assertions
	suite.NoError(err)
}

// TestMTOMilestoneNoteDeleteWithInvalidID tests deleting a note with invalid ID
func (suite *ResolverSuite) TestMTOMilestoneNoteDeleteWithInvalidID() {
	invalidID := uuid.New()

	err := DeleteMTOMilestoneNote(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		invalidID,
	)

	suite.Error(err)
	suite.Contains(err.Error(), "unable to delete MTO milestone note")
}

// TestMTOMilestoneNoteGetByMilestoneID tests getting notes by milestone ID
func (suite *ResolverSuite) TestMTOMilestoneNoteGetByMilestoneID() {
	// Create model plan and milestone
	plan := suite.createModelPlan("Test Plan for Getting MTO Milestone Notes")
	milestone := suite.createMilestoneCommon(plan.ID, models.MTOCommonMilestoneKeyManageCd, []models.MTOCommonSolutionKey{})

	// Create multiple notes for the same milestone
	note1 := suite.createMTOMilestoneNote(milestone, "First note")
	note2 := suite.createMTOMilestoneNote(milestone, "Second note")
	note3 := suite.createMTOMilestoneNote(milestone, "Third note")

	// Get notes by milestone ID
	notes, err := GetMTOMilestoneNotesByMilestoneIDLOADER(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		milestone.ID,
	)

	// Assertions
	suite.NoError(err)
	suite.Len(notes, 3)

	// Check that all notes are returned
	noteIDs := make([]uuid.UUID, len(notes))
	for i, note := range notes {
		noteIDs[i] = note.ID
		suite.Equal(milestone.ID, note.MTOMilestoneID)
	}

	suite.Contains(noteIDs, note1.ID)
	suite.Contains(noteIDs, note2.ID)
	suite.Contains(noteIDs, note3.ID)
}

// TestMTOMilestoneNoteGetByMilestoneIDWithNoNotes tests getting notes for milestone with no notes
func (suite *ResolverSuite) TestMTOMilestoneNoteGetByMilestoneIDWithNoNotes() {
	plan := suite.createModelPlan("Test Plan for Empty Milestone Notes")
	milestone := suite.createMilestoneCommon(plan.ID, models.MTOCommonMilestoneKeyManageCd, []models.MTOCommonSolutionKey{})

	notes, err := GetMTOMilestoneNotesByMilestoneIDLOADER(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		milestone.ID,
	)

	suite.NoError(err)
	suite.Len(notes, 0)
}

// TestMTOMilestoneNoteGetByID tests getting a single note by ID
func (suite *ResolverSuite) TestMTOMilestoneNoteGetByID() {
	plan := suite.createModelPlan("Test Plan for Getting MTO Milestone Note by ID")
	milestone := suite.createMilestoneCommon(plan.ID, models.MTOCommonMilestoneKeyManageCd, []models.MTOCommonSolutionKey{})
	note := suite.createMTOMilestoneNote(milestone, "Test note content")

	retrievedNote, err := GetMTOMilestoneNoteByIDLOADER(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		note.ID,
	)

	suite.NoError(err)
	suite.NotNil(retrievedNote)
	suite.Equal(note.ID, retrievedNote.ID)
	suite.Equal(note.Content, retrievedNote.Content)
	suite.Equal(note.MTOMilestoneID, retrievedNote.MTOMilestoneID)
	suite.Equal(note.ModelPlanID, retrievedNote.ModelPlanID)
}

// TestMTOMilestoneNoteGetByIDWithInvalidID tests getting a note with invalid ID
func (suite *ResolverSuite) TestMTOMilestoneNoteGetByIDWithInvalidID() {
	invalidID := uuid.New()

	retrievedNote, err := GetMTOMilestoneNoteByIDLOADER(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		invalidID,
	)

	suite.Error(err)
	suite.Nil(retrievedNote)
}

// TestMTOMilestoneNoteMultipleMilestones tests notes across multiple milestones
func (suite *ResolverSuite) TestMTOMilestoneNoteMultipleMilestones() {
	plan := suite.createModelPlan("Test Plan for Multiple Milestone Notes")

	// Create two milestones
	milestone1 := suite.createMilestoneCommon(plan.ID, models.MTOCommonMilestoneKeyManageCd, []models.MTOCommonSolutionKey{})
	milestone2 := suite.createMilestoneCommon(plan.ID, models.MTOCommonMilestoneKeyAdjustFfsClaims, []models.MTOCommonSolutionKey{})

	// Create notes for each milestone
	note1 := suite.createMTOMilestoneNote(milestone1, "Note for milestone 1")
	note2 := suite.createMTOMilestoneNote(milestone1, "Another note for milestone 1")
	note3 := suite.createMTOMilestoneNote(milestone2, "Note for milestone 2")

	// Get notes for milestone 1
	notes1, err := GetMTOMilestoneNotesByMilestoneIDLOADER(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		milestone1.ID,
	)

	suite.NoError(err)
	suite.Len(notes1, 2)

	// Get notes for milestone 2
	notes2, err := GetMTOMilestoneNotesByMilestoneIDLOADER(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		milestone2.ID,
	)

	suite.NoError(err)
	suite.Len(notes2, 1)

	// Verify correct notes are returned
	note1IDs := make([]uuid.UUID, len(notes1))
	for i, note := range notes1 {
		note1IDs[i] = note.ID
		suite.Equal(milestone1.ID, note.MTOMilestoneID)
	}

	suite.Contains(note1IDs, note1.ID)
	suite.Contains(note1IDs, note2.ID)
	suite.Equal(note3.ID, notes2[0].ID)
	suite.Equal(milestone2.ID, notes2[0].MTOMilestoneID)
}

// Helper function to create an MTO milestone note for testing
func (suite *ResolverSuite) createMTOMilestoneNote(milestone *models.MTOMilestone, content string) *models.MTOMilestoneNote {
	note, err := CreateMTOMilestoneNote(
		suite.testConfigs.Context,
		suite.testConfigs.Logger,
		suite.testConfigs.Principal,
		suite.testConfigs.Store,
		models.MTOMilestoneNoteCreateInput{
			Content:        content,
			MTOMilestoneID: milestone.ID,
		},
	)
	suite.NoError(err)
	suite.NotNil(note)
	return note
}
