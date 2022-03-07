package graph

import (
	"context"
	"fmt"
	"time"

	"github.com/guregu/null"
	_ "github.com/lib/pq" // required for postgres driver in sql

	"github.com/cmsgov/easi-app/pkg/models"
	"github.com/cmsgov/easi-app/pkg/testhelpers"
)

func (s GraphQLTestSuite) TestCreateSystemIntakeMutation() {
	var resp struct {
		CreateSystemIntake struct {
			ID          string
			Status      string
			RequestType string
			Requester   struct {
				Name string
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(
		`mutation {
			createSystemIntake(input: {
				requestType: NEW,
				requester: {
					name: "Test User"
				}
			}) {
				id
				status
				requestType
				requester {
					name
				}
			}
		}`, &resp)

	s.NotNil(resp.CreateSystemIntake.ID)
	s.Equal("Test User", resp.CreateSystemIntake.Requester.Name)
	s.Equal("INTAKE_DRAFT", resp.CreateSystemIntake.Status)
	s.Equal("NEW", resp.CreateSystemIntake.RequestType)
}

func (s GraphQLTestSuite) TestFetchSystemIntakeQuery() {
	ctx := context.Background()
	projectName := "Big Project"
	businessOwner := "Firstname Lastname"
	businessOwnerComponent := "OIT"

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		ProjectName:            null.StringFrom(projectName),
		Status:                 models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType:            models.SystemIntakeRequestTypeNEW,
		BusinessOwner:          null.StringFrom(businessOwner),
		BusinessOwnerComponent: null.StringFrom(businessOwnerComponent),
	})
	s.NoError(intakeErr)

	var resp struct {
		SystemIntake struct {
			ID            string
			RequestName   string
			Status        string
			RequestType   string
			BusinessOwner struct {
				Name      string
				Component string
			}
			BusinessOwnerComponent string
			BusinessNeed           *string
			BusinessCase           *string
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				requestName
				status
				requestType
				businessOwner {
					name
					component
				}
				businessNeed
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)
	s.Equal(projectName, resp.SystemIntake.RequestName)
	s.Equal("INTAKE_SUBMITTED", resp.SystemIntake.Status)
	s.Equal("NEW", resp.SystemIntake.RequestType)
	s.Equal(businessOwner, resp.SystemIntake.BusinessOwner.Name)
	s.Equal(businessOwnerComponent, resp.SystemIntake.BusinessOwner.Component)
	s.Nil(resp.SystemIntake.BusinessNeed)
	s.Nil(resp.SystemIntake.BusinessCase)
}

func (s GraphQLTestSuite) TestFetchSystemIntakeWithNotesQuery() {
	ctx := context.Background()
	projectName := "Big Project"
	businessOwner := "Firstname Lastname"
	businessOwnerComponent := "OIT"

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		ProjectName:            null.StringFrom(projectName),
		Status:                 models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType:            models.SystemIntakeRequestTypeNEW,
		BusinessOwner:          null.StringFrom(businessOwner),
		BusinessOwnerComponent: null.StringFrom(businessOwnerComponent),
	})
	s.NoError(intakeErr)

	note1, noteErr := s.store.CreateNote(ctx, &models.Note{
		SystemIntakeID: intake.ID,
		AuthorEUAID:    "QQQQ",
		AuthorName:     null.StringFrom("Author Name Q"),
		Content:        null.StringFrom("a clever remark"),
		CreatedAt:      date(2021, 5, 2),
	})
	s.NoError(noteErr)

	note2, noteErr := s.store.CreateNote(ctx, &models.Note{
		SystemIntakeID: intake.ID,
		AuthorEUAID:    "WWWW",
		AuthorName:     null.StringFrom("Author Name W"),
		Content:        null.StringFrom("a cleverer remark"),
		CreatedAt:      date(2021, 5, 3),
	})
	s.NoError(noteErr)

	var resp struct {
		SystemIntake struct {
			ID    string
			Notes []struct {
				ID     string
				Author struct {
					Name string
					EUA  string
				}
				Content   string
				CreatedAt string
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				notes {
					id
					createdAt
					content
					author {
						name
						eua
					}
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest("WWWW"))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)

	s.Len(resp.SystemIntake.Notes, 2)

	respNote2 := resp.SystemIntake.Notes[0]
	s.Equal(note2.ID.String(), respNote2.ID)
	s.Equal("a cleverer remark", respNote2.Content)
	s.Equal("WWWW", respNote2.Author.EUA)
	s.Equal("Author Name W", respNote2.Author.Name)
	s.NotEmpty(respNote2.CreatedAt)

	respNote1 := resp.SystemIntake.Notes[1]
	s.Equal(note1.ID.String(), respNote1.ID)
	s.Equal("a clever remark", respNote1.Content)
	s.Equal("QQQQ", respNote1.Author.EUA)
	s.Equal("Author Name Q", respNote1.Author.Name)
	s.NotEmpty(respNote1.CreatedAt)
}

func (s GraphQLTestSuite) TestFetchSystemIntakeWithContractMonthAndYearQuery() {
	ctx := context.Background()
	contracStartMonth := "10"
	contractStartYear := "2002"
	contractEndMonth := "08"
	contractEndYear := "2020"
	projectName := "My cool project"

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		ProjectName:        null.StringFrom(projectName),
		Status:             models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType:        models.SystemIntakeRequestTypeNEW,
		ContractStartMonth: null.StringFrom(contracStartMonth),
		ContractStartYear:  null.StringFrom(contractStartYear),
		ContractEndMonth:   null.StringFrom(contractEndMonth),
		ContractEndYear:    null.StringFrom(contractEndYear),
	})
	s.NoError(intakeErr)

	var resp struct {
		SystemIntake struct {
			ID       string
			Contract struct {
				EndDate struct {
					Day   string
					Month string
					Year  string
				}
				StartDate struct {
					Day   string
					Month string
					Year  string
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				contract {
					endDate {
						day
						month
						year
					}
					startDate {
						day
						month
						year
					}
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)

	startDate := resp.SystemIntake.Contract.StartDate
	s.Equal("", startDate.Day)
	s.Equal(contracStartMonth, startDate.Month)
	s.Equal(contractStartYear, startDate.Year)

	endDate := resp.SystemIntake.Contract.EndDate
	s.Equal("", endDate.Day)
	s.Equal(contractEndMonth, endDate.Month)
	s.Equal(contractEndYear, endDate.Year)
}

func (s GraphQLTestSuite) TestFetchSystemIntakeWithContractDatesQuery() {
	ctx := context.Background()
	projectName := "My cool project"
	contractStartDate, _ := time.Parse("2006-1-2", "2002-8-24")
	contractEndDate, _ := time.Parse("2006-1-2", "2020-10-31")

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		ProjectName:       null.StringFrom(projectName),
		Status:            models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType:       models.SystemIntakeRequestTypeNEW,
		ContractStartDate: &contractStartDate,
		ContractEndDate:   &contractEndDate,
	})
	s.NoError(intakeErr)

	var resp struct {
		SystemIntake struct {
			ID       string
			Contract struct {
				EndDate struct {
					Day   string
					Month string
					Year  string
				}
				StartDate struct {
					Day   string
					Month string
					Year  string
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				contract {
					endDate {
						day
						month
						year
					}
					startDate {
						day
						month
						year
					}
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)

	startDate := resp.SystemIntake.Contract.StartDate
	s.Equal("24", startDate.Day)
	s.Equal("8", startDate.Month)
	s.Equal("2002", startDate.Year)

	endDate := resp.SystemIntake.Contract.EndDate
	s.Equal("31", endDate.Day)
	s.Equal("10", endDate.Month)
	s.Equal("2020", endDate.Year)
}

func (s GraphQLTestSuite) TestFetchSystemIntakeWithNoCollaboratorsQuery() {
	ctx := context.Background()
	projectName := "My cool project"

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		ProjectName:                 null.StringFrom(projectName),
		Status:                      models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType:                 models.SystemIntakeRequestTypeNEW,
		EACollaboratorName:          null.StringFrom(""),
		OITSecurityCollaboratorName: null.StringFrom(""),
		TRBCollaboratorName:         null.StringFrom(""),
	})
	s.NoError(intakeErr)

	var resp struct {
		SystemIntake struct {
			ID              string
			GovernanceTeams struct {
				IsPresent bool
				Teams     []struct {
					Acronym      string
					Collaborator string
					Key          string
					Label        string
					Name         string
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				governanceTeams {
					isPresent
					teams {
						acronym
						collaborator
						key
						label
						name
					}
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)
	s.False(resp.SystemIntake.GovernanceTeams.IsPresent)
	s.Nil(resp.SystemIntake.GovernanceTeams.Teams)
}

func (s GraphQLTestSuite) TestFetchSystemIntakeWithCollaboratorsQuery() {
	ctx := context.Background()
	projectName := "My cool project"
	eaName := "My EA Rep"
	oitName := "My OIT Rep"
	trbName := "My TRB Rep"

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		ProjectName:                 null.StringFrom(projectName),
		Status:                      models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType:                 models.SystemIntakeRequestTypeNEW,
		EACollaboratorName:          null.StringFrom(eaName),
		OITSecurityCollaboratorName: null.StringFrom(oitName),
		TRBCollaboratorName:         null.StringFrom(trbName),
	})
	s.NoError(intakeErr)

	var resp struct {
		SystemIntake struct {
			ID              string
			GovernanceTeams struct {
				IsPresent bool
				Teams     []struct {
					Acronym      string
					Collaborator string
					Key          string
					Label        string
					Name         string
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				governanceTeams {
					isPresent
					teams {
						acronym
						collaborator
						key
						label
						name
					}
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(intake.ID.String(), resp.SystemIntake.ID)
	s.True(resp.SystemIntake.GovernanceTeams.IsPresent)
	s.Equal(trbName, resp.SystemIntake.GovernanceTeams.Teams[0].Collaborator)
	s.Equal(oitName, resp.SystemIntake.GovernanceTeams.Teams[1].Collaborator)
	s.Equal(eaName, resp.SystemIntake.GovernanceTeams.Teams[2].Collaborator)
}

func (s GraphQLTestSuite) TestFetchSystemIntakeWithActionsQuery() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		ProjectName: null.StringFrom("Test Project"),
		Status:      models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	action1, action1Err := s.store.CreateAction(ctx, &models.Action{
		IntakeID:       &intake.ID,
		ActionType:     models.ActionTypeSUBMITINTAKE,
		ActorName:      "First Actor",
		ActorEmail:     "first.actor@example.com",
		ActorEUAUserID: "ACT1",
		CreatedAt:      date(2021, 4, 1),
	})
	s.NoError(action1Err)

	action2, action2Err := s.store.CreateAction(ctx, &models.Action{
		IntakeID:       &intake.ID,
		ActionType:     models.ActionTypePROVIDEFEEDBACKNEEDBIZCASE,
		ActorName:      "Second Actor",
		ActorEmail:     "second.actor@example.com",
		ActorEUAUserID: "ACT2",
		Feedback:       null.StringFrom("feedback for action two"),
		CreatedAt:      date(2021, 4, 2),
	})
	s.NoError(action2Err)

	var resp struct {
		SystemIntake struct {
			ID      string
			Actions []struct {
				ID    string
				Type  string
				Actor struct {
					Name  string
					Email string
				}
				Feedback  *string
				CreatedAt string
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`query {
			systemIntake(id: "%s") {
				id
				actions {
					id
					type
					actor {
						name
						email
					}
					feedback
					createdAt
				}
			}
		}`, intake.ID), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest(testhelpers.RandomEUAID()))

	s.Equal(2, len(resp.SystemIntake.Actions))

	respAction2 := resp.SystemIntake.Actions[0]
	s.Equal(action2.ID.String(), respAction2.ID)
	s.Equal("feedback for action two", *respAction2.Feedback)
	s.Equal(action2.CreatedAt.UTC().Format(time.RFC3339), respAction2.CreatedAt)
	s.Equal("PROVIDE_FEEDBACK_NEED_BIZ_CASE", respAction2.Type)
	s.Equal("Second Actor", respAction2.Actor.Name)
	s.Equal("second.actor@example.com", respAction2.Actor.Email)

	respAction1 := resp.SystemIntake.Actions[1]
	s.Equal(action1.ID.String(), respAction1.ID)
	s.Nil(respAction1.Feedback)
	s.Equal(action1.CreatedAt.UTC().Format(time.RFC3339), respAction1.CreatedAt)
	s.Equal("SUBMIT_INTAKE", respAction1.Type)
	s.Equal("First Actor", respAction1.Actor.Name)
	s.Equal("first.actor@example.com", respAction1.Actor.Email)
}

func (s GraphQLTestSuite) TestIssueLifecycleIDWithPassedLCID() {
	ctx := context.Background()
	projectName := "My cool project"

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		ProjectName: null.StringFrom(projectName),
		Status:      models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		IssueLifecycleID struct {
			SystemIntake struct {
				ID                string
				Lcid              string
				LcidExpiresAt     string
				LcidScope         string
				LcidCostBaseline  string
				DecisionNextSteps string
				Status            string
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`mutation {
			issueLifecycleId(input: {
				intakeId: "%s",
				expiresAt: "2021-03-18T00:00:00Z",
				scope: "Your scope",
				feedback: "My feedback",
				lcid: "123456A",
				costBaseline: "Your cost baseline",
				nextSteps: "Your next steps"
			}) {
				systemIntake {
					id
					lcid
					lcidExpiresAt
					lcidScope
					lcidCostBaseline
					decisionNextSteps
					status
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.IssueLifecycleID.SystemIntake.ID)

	respIntake := resp.IssueLifecycleID.SystemIntake
	s.Equal(respIntake.LcidExpiresAt, "2021-03-18T00:00:00Z")
	s.Equal(respIntake.Lcid, "123456A")
	s.Equal(respIntake.LcidCostBaseline, "Your cost baseline")
}

func (s GraphQLTestSuite) TestIssueLifecycleIDSetNewLCID() {
	ctx := context.Background()
	projectName := "My cool project"

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		ProjectName: null.StringFrom(projectName),
		Status:      models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		IssueLifecycleID struct {
			SystemIntake struct {
				ID                string
				Lcid              string
				LcidExpiresAt     string
				LcidScope         string
				LcidCostBaseline  string
				DecisionNextSteps string
				Status            string
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`mutation {
			issueLifecycleId(input: {
				intakeId: "%s",
				expiresAt: "2021-03-18T00:00:00Z",
				scope: "Your scope",
				feedback: "My feedback",
				lcid: "",
				nextSteps: "Your next steps",
				costBaseline: "Test cost baseline"
			}) {
				systemIntake {
					id
					lcid
					lcidExpiresAt
					lcidScope
					lcidCostBaseline
					decisionNextSteps
					status
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.IssueLifecycleID.SystemIntake.ID)

	respIntake := resp.IssueLifecycleID.SystemIntake
	s.Equal(respIntake.LcidExpiresAt, "2021-03-18T00:00:00Z")
	s.Equal(respIntake.Lcid, "654321B")
	s.Equal(respIntake.LcidCostBaseline, "Test cost baseline")

}

func date(year, month, day int) *time.Time {
	date := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
	return &date
}

func (s GraphQLTestSuite) TestUpdateContactDetails() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:      models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeContactDetails struct {
			SystemIntake struct {
				ID            string
				BusinessOwner struct {
					Name      string
					Component string
				}
				ProductManager struct {
					Name      string
					Component string
				}
				Requester struct {
					Name      string
					Component string
				}
				Isso struct {
					IsPresent bool
					Name      null.String
				}
				GovernanceTeams struct {
					IsPresent bool
					Teams     null.String
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContactDetails(input: {
				id: "%s",
				businessOwner: {
					name: "Iama Businessowner",
					component: "CMS Office 1"
				},
				productManager: {
					name: "Iama Productmanager",
					component: "CMS Office 2"
				},
				requester: {
					name: "Iama Requester",
					component: "CMS Office 3"
				},
				isso: {
					isPresent: false
					name: null
				},
				governanceTeams: {
					isPresent: false
					teams: []
				}
			}) {
				systemIntake {
					id,
					businessOwner {
						name
						component
					}
					productManager {
						name
						component
					}
					requester {
						name
						component
					}
					isso {
						name
						isPresent
					}
					governanceTeams {
						teams {
							name
						}
						isPresent
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContactDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContactDetails.SystemIntake
	s.Equal(respIntake.BusinessOwner.Name, "Iama Businessowner")
	s.Equal(respIntake.BusinessOwner.Component, "CMS Office 1")

	s.Equal(respIntake.ProductManager.Name, "Iama Productmanager")
	s.Equal(respIntake.ProductManager.Component, "CMS Office 2")

	s.Equal(respIntake.Requester.Name, "Iama Requester")
	s.Equal(respIntake.Requester.Component, "CMS Office 3")

	s.Nil(respIntake.Isso.Name.Ptr())
	s.False(respIntake.Isso.IsPresent)

	s.Nil(respIntake.GovernanceTeams.Teams.Ptr())
	s.False(respIntake.GovernanceTeams.IsPresent)
}

func (s GraphQLTestSuite) TestUpdateContactDetailsWithISSOAndTeams() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:      models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeContactDetails struct {
			SystemIntake struct {
				ID            string
				BusinessOwner struct {
					Name      string
					Component string
				}
				ProductManager struct {
					Name      string
					Component string
				}
				Requester struct {
					Name      string
					Component string
				}
				Isso struct {
					IsPresent bool
					Name      string
				}
				GovernanceTeams struct {
					IsPresent bool
					Teams     []struct {
						Name         string
						Collaborator string
						Key          string
					}
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContactDetails(input: {
				id: "%s",
				businessOwner: {
					name: "Iama Businessowner",
					component: "CMS Office 1"
				},
				productManager: {
					name: "Iama Productmanager",
					component: "CMS Office 2"
				},
				requester: {
					name: "Iama Requester",
					component: "CMS Office 3"
				},
				isso: {
					isPresent: true,
					name: "Iama Issoperson"
				},
				governanceTeams: {
					isPresent: true,
					teams: [
						{ name: "Technical Review Board", key: "technicalReviewBoard", collaborator: "Iama Trbperson" },
						{ name: "OIT's Security and Privacy Group", key: "securityPrivacy", collaborator: "Iama Ispgperson" },
						{ name: "Enterprise Architecture", key: "enterpriseArchitecture", collaborator: "Iama Eaperson" }
					]
				}
			}) {
				systemIntake {
					id,
					businessOwner {
						name
						component
					}
					productManager {
						name
						component
					}
					requester {
						name
						component
					}
					isso {
						name
						isPresent
					}
					governanceTeams {
						teams {
							collaborator
							key
						}
						isPresent
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContactDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContactDetails.SystemIntake
	s.Equal("Iama Issoperson", respIntake.Isso.Name)
	s.True(respIntake.Isso.IsPresent)

	s.True(respIntake.GovernanceTeams.IsPresent)
	teams := respIntake.GovernanceTeams.Teams
	s.Equal("Iama Trbperson", teams[0].Collaborator)
	s.Equal("technicalReviewBoard", teams[0].Key)

	s.Equal("Iama Ispgperson", teams[1].Collaborator)
	s.Equal("securityPrivacy", teams[1].Key)

	s.Equal("Iama Eaperson", teams[2].Collaborator)
	s.Equal("enterpriseArchitecture", teams[2].Key)
}

func (s GraphQLTestSuite) TestUpdateContactDetailsWillClearISSOAndTeams() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:      models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	intake.ISSOName = null.StringFrom("Isso Person")
	intake.TRBCollaboratorName = null.StringFrom("TRB Person")
	intake.OITSecurityCollaboratorName = null.StringFrom("OIT Person")
	intake.EACollaboratorName = null.StringFrom("EA Person")
	_, err := s.store.UpdateSystemIntake(ctx, intake)
	s.NoError(err)

	var resp struct {
		UpdateSystemIntakeContactDetails struct {
			SystemIntake struct {
				ID            string
				BusinessOwner struct {
					Name      string
					Component string
				}
				ProductManager struct {
					Name      string
					Component string
				}
				Requester struct {
					Name      string
					Component string
				}
				Isso struct {
					IsPresent bool
					Name      null.String
				}
				GovernanceTeams struct {
					IsPresent bool
					Teams     null.String
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContactDetails(input: {
				id: "%s",
				businessOwner: {
					name: "Iama Businessowner",
					component: "CMS Office 1"
				},
				productManager: {
					name: "Iama Productmanager",
					component: "CMS Office 2"
				},
				requester: {
					name: "Iama Requester",
					component: "CMS Office 3"
				},
				isso: {
					isPresent: false,
					name: null
				},
				governanceTeams: {
					isPresent: false,
					teams: null
				}
			}) {
				systemIntake {
					id,
					businessOwner {
						name
						component
					}
					productManager {
						name
						component
					}
					requester {
						name
						component
					}
					isso {
						name
						isPresent
					}
					governanceTeams {
						teams {
							collaborator
							key
						}
						isPresent
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContactDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContactDetails.SystemIntake
	s.Nil(respIntake.Isso.Name.Ptr())
	s.False(respIntake.Isso.IsPresent)

	s.Nil(respIntake.GovernanceTeams.Teams.Ptr())
	s.False(respIntake.GovernanceTeams.IsPresent)
}

func (s GraphQLTestSuite) TestUpdateContactDetailsWillClearOneTeam() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:      models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	intake.ISSOName = null.StringFrom("Isso Person")
	intake.TRBCollaboratorName = null.StringFrom("TRB Person")
	intake.OITSecurityCollaboratorName = null.StringFrom("OIT Person")
	intake.EACollaboratorName = null.StringFrom("EA Person")
	_, err := s.store.UpdateSystemIntake(ctx, intake)
	s.NoError(err)

	var resp struct {
		UpdateSystemIntakeContactDetails struct {
			SystemIntake struct {
				ID            string
				BusinessOwner struct {
					Name      string
					Component string
				}
				ProductManager struct {
					Name      string
					Component string
				}
				Requester struct {
					Name      string
					Component string
				}
				Isso struct {
					IsPresent bool
					Name      null.String
				}
				GovernanceTeams struct {
					IsPresent bool
					Teams     []struct {
						Name         string
						Collaborator string
						Key          string
					}
				}
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContactDetails(input: {
				id: "%s",
				businessOwner: {
					name: "Iama Businessowner",
					component: "CMS Office 1"
				},
				productManager: {
					name: "Iama Productmanager",
					component: "CMS Office 2"
				},
				requester: {
					name: "Iama Requester",
					component: "CMS Office 3"
				},
				isso: {
					isPresent: false,
					name: null
				},
				governanceTeams: {
					isPresent: true,
					teams: [
						{ name: "Technical Review Board", key: "technicalReviewBoard", collaborator: "Iama Trbperson" },
						{ name: "OIT's Security and Privacy Group", key: "securityPrivacy", collaborator: "Iama Ispgperson" }
					]
				}
			}) {
				systemIntake {
					id,
					businessOwner {
						name
						component
					}
					productManager {
						name
						component
					}
					requester {
						name
						component
					}
					isso {
						name
						isPresent
					}
					governanceTeams {
						teams {
							collaborator
							key
						}
						isPresent
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContactDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContactDetails.SystemIntake
	s.True(respIntake.GovernanceTeams.IsPresent)
	teams := respIntake.GovernanceTeams.Teams
	s.Equal(2, len(teams))
	s.Equal("Iama Trbperson", teams[0].Collaborator)
	s.Equal("technicalReviewBoard", teams[0].Key)

	s.Equal("Iama Ispgperson", teams[1].Collaborator)
	s.Equal("securityPrivacy", teams[1].Key)
}

func (s GraphQLTestSuite) TestUpdateRequestDetails() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:      models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeRequestDetails struct {
			SystemIntake struct {
				ID               string
				RequestName      string
				BusinessSolution string
				BusinessNeed     string
				CurrentStage     string
				NeedsEaSupport   bool
			}
		}
	}

	// TODO we're supposed to be able to pass variables as additional arguments using client.Var()
	// but it wasn't working for me.
	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeRequestDetails(input: {
				id: "%s",
				requestName: "My request",
				businessSolution: "My solution",
				businessNeed: "My need",
				currentStage:  "Just an idea",
				needsEaSupport: false
			}) {
				systemIntake {
					id
					requestName
					businessSolution
					businessNeed
					currentStage
					needsEaSupport
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeRequestDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeRequestDetails.SystemIntake
	s.Equal(respIntake.RequestName, "My request")
	s.Equal(respIntake.BusinessSolution, "My solution")
	s.Equal(respIntake.BusinessNeed, "My need")
	s.Equal(respIntake.CurrentStage, "Just an idea")
	s.False(respIntake.NeedsEaSupport)
}

func (s GraphQLTestSuite) TestUpdateContractDetails() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:      models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType: models.SystemIntakeRequestTypeNEW,
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeContractDetails struct {
			SystemIntake struct {
				ID            string
				FundingSource struct {
					FundingNumber string
					IsFunded      bool
					Source        string
				}
				Costs struct {
					ExpectedIncreaseAmount string
					IsExpectingIncrease    string
				}
				Contract struct {
					Contractor string
					EndDate    struct {
						Day   string
						Month string
						Year  string
					}
					HasContract string
					StartDate   struct {
						Day   string
						Month string
						Year  string
					}
					Vehicle string
				}
			}
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContractDetails(input: {
				id: "%s",
				fundingSource: {
					fundingNumber: "123456"
					isFunded: true
					source: "Prog Ops"
				}
				costs: {
					expectedIncreaseAmount: "A little bit"
					isExpectingIncrease: "YES"
				}
				contract: {
					contractor: "Best Contractor Evar"
					endDate: "2022-02-03T00:00:00Z"
					hasContract: "HAVE_CONTRACT"
					startDate: "2021-11-12T00:00:00Z"
					vehicle: "Toyota Prius"
				}
			}) {
				systemIntake {
					id
					fundingSource {
						fundingNumber
						isFunded
						source
					}
					costs {
						expectedIncreaseAmount
						isExpectingIncrease
					}
					contract {
						contractor
						endDate {
							day
							month
							year
						}
						hasContract
						startDate {
							day
							month
							year
						}
						vehicle
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContractDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContractDetails.SystemIntake

	fundingSource := respIntake.FundingSource
	s.Equal(fundingSource.FundingNumber, "123456")
	s.True(fundingSource.IsFunded)
	s.Equal(fundingSource.Source, "Prog Ops")

	costs := respIntake.Costs
	s.Equal(costs.ExpectedIncreaseAmount, "A little bit")
	s.Equal(costs.IsExpectingIncrease, "YES")

	contract := respIntake.Contract
	s.Equal(contract.HasContract, "HAVE_CONTRACT")
	s.Equal(contract.Contractor, "Best Contractor Evar")
	s.Equal(contract.Vehicle, "Toyota Prius")

	startDate := contract.StartDate
	s.Equal(startDate.Day, "12")
	s.Equal(startDate.Month, "11")
	s.Equal(startDate.Year, "2021")

	endDate := contract.EndDate
	s.Equal(endDate.Day, "3")
	s.Equal(endDate.Month, "2")
	s.Equal(endDate.Year, "2022")
}

func (s GraphQLTestSuite) TestUpdateContractDetailsRemoveFundingSource() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:          models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType:     models.SystemIntakeRequestTypeNEW,
		ExistingFunding: null.BoolFrom(true),
		FundingSource:   null.StringFrom("Prog Ops"),
		FundingNumber:   null.StringFrom("123456"),
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeContractDetails struct {
			SystemIntake struct {
				ID            string
				FundingSource struct {
					FundingNumber *string
					IsFunded      bool
					Source        *string
				}
			}
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContractDetails(input: {
				id: "%s",
				fundingSource: {
					fundingNumber: ""
					isFunded: false
					source: ""
				}
			}) {
				systemIntake {
					id
					fundingSource {
						fundingNumber
						isFunded
						source
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContractDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContractDetails.SystemIntake
	fundingSource := respIntake.FundingSource
	s.Nil(fundingSource.FundingNumber)
	s.False(fundingSource.IsFunded)
	s.Nil(fundingSource.Source)
}

func (s GraphQLTestSuite) TestUpdateContractDetailsRemoveCosts() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:             models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType:        models.SystemIntakeRequestTypeNEW,
		CostIncreaseAmount: null.StringFrom("Just a little"),
		CostIncrease:       null.StringFrom("YES"),
	})
	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeContractDetails struct {
			SystemIntake struct {
				ID    string
				Costs struct {
					ExpectedIncreaseAmount *string
					IsExpectingIncrease    string
				}
			}
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContractDetails(input: {
				id: "%s",
				costs: {
					expectedIncreaseAmount: ""
					isExpectingIncrease: "No"
				}
			}) {
				systemIntake {
					id
					costs {
						expectedIncreaseAmount
						isExpectingIncrease
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContractDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContractDetails.SystemIntake
	costs := respIntake.Costs
	s.Nil(costs.ExpectedIncreaseAmount)
	s.Equal(costs.IsExpectingIncrease, "No")
}

func (s GraphQLTestSuite) TestUpdateContractDetailsRemoveContract() {
	ctx := context.Background()

	contractStartDate, _ := time.Parse("2006-1-2", "2002-8-24")
	contractEndDate, _ := time.Parse("2006-1-2", "2020-10-31")

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:            models.SystemIntakeStatusINTAKESUBMITTED,
		RequestType:       models.SystemIntakeRequestTypeNEW,
		ExistingContract:  null.StringFrom("HAVE_CONTRACT"),
		Contractor:        null.StringFrom("Best Contractor Evar"),
		ContractVehicle:   null.StringFrom("Toyota Prius"),
		ContractStartDate: &contractStartDate,
		ContractEndDate:   &contractEndDate,
	})

	s.NoError(intakeErr)

	var resp struct {
		UpdateSystemIntakeContractDetails struct {
			SystemIntake struct {
				ID       string
				Contract struct {
					Contractor *string
					EndDate    struct {
						Day   *string
						Month *string
						Year  *string
					}
					HasContract string
					StartDate   struct {
						Day   *string
						Month *string
						Year  *string
					}
					Vehicle *string
				}
			}
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			updateSystemIntakeContractDetails(input: {
				id: "%s",
				contract: {
					contractor: ""
					startDate: null
					hasContract: "NOT_STARTED"
					endDate: null
					vehicle: ""
				}
			}) {
				systemIntake {
					id
					contract {
						contractor
						endDate {
							day
							month
							year
						}
						hasContract
						startDate {
							day
							month
							year
						}
						vehicle
					}
				}
			}
		}`, intake.ID), &resp)

	s.Equal(intake.ID.String(), resp.UpdateSystemIntakeContractDetails.SystemIntake.ID)

	respIntake := resp.UpdateSystemIntakeContractDetails.SystemIntake
	contract := respIntake.Contract
	s.Equal(contract.HasContract, "NOT_STARTED")
	s.Nil(contract.Contractor)
	s.Nil(contract.Vehicle)

	startDate := contract.StartDate
	s.Nil(startDate.Day)
	s.Nil(startDate.Month)
	s.Nil(startDate.Year)

	endDate := contract.EndDate
	s.Nil(endDate.Day)
	s.Nil(endDate.Month)
	s.Nil(endDate.Year)
}

func (s GraphQLTestSuite) TestSubmitIntake() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:      models.SystemIntakeStatusINTAKEDRAFT,
		RequestType: models.SystemIntakeRequestTypeNEW,
		EUAUserID:   null.StringFrom("TEST"),
	})
	s.NoError(intakeErr)

	var resp struct {
		SubmitIntake struct {
			SystemIntake struct {
				ID     string
				Status string
			}
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			submitIntake(input: {
				id: "%s",
			}) {
				systemIntake {
					id
					status
				}
			}
		}`, intake.ID), &resp)

	respIntake := resp.SubmitIntake.SystemIntake
	s.Equal(intake.ID.String(), respIntake.ID)
	s.Equal(string(models.SystemIntakeStatusINTAKESUBMITTED), respIntake.Status)
}

func (s GraphQLTestSuite) TestExtendLifecycleId() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:      models.SystemIntakeStatusLCIDISSUED,
		RequestType: models.SystemIntakeRequestTypeNEW,
		EUAUserID:   null.StringFrom("TEST"),
	})
	s.NoError(intakeErr)

	intake.LifecycleID = null.StringFrom("123456")
	intake.LifecycleExpiresAt = date(2021, 12, 1)
	intake.LifecycleScope = null.StringFrom("Original Scope")
	intake.DecisionNextSteps = null.StringFrom("Original Next Steps")
	intake.LifecycleCostBaseline = null.StringFrom("Original Cost Baseline")

	_, updateErr := s.store.UpdateSystemIntake(ctx, intake)
	s.NoError(updateErr)

	type userErrors []struct {
		Message string
		Path    []string
	}

	var resp struct {
		CreateSystemIntakeActionExtendLifecycleID struct {
			SystemIntake struct {
				ID                string
				LcidExpiresAt     string
				LcidScope         string
				DecisionNextSteps string
				LcidCostBaseline  string
				Lcid              string
				Actions           []struct {
					ID    string
					Type  string
					Actor struct {
						Name  string
						Email string
					}
					Feedback             string
					LcidExpirationChange struct {
						NewDate              string
						PreviousDate         string
						NewScope             string
						PreviousScope        string
						NewNextSteps         string
						PreviousNextSteps    string
						NewCostBaseline      string
						PreviousCostBaseline string
					}
				}
			}
			UserErrors userErrors
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			createSystemIntakeActionExtendLifecycleId(input: {
				id: "%s",
				expirationDate: "%s",
				scope: "%s",
				nextSteps: "%s",
				costBaseline: "%s",
			}) {
				systemIntake {
					id
					lcid
					lcidExpiresAt
					lcidScope
					decisionNextSteps
					lcidCostBaseline
					actions {
						type
						actor {
							name
							email
						}
						feedback
						lcidExpirationChange {
							previousDate
							newDate
							previousScope
							newScope
							previousNextSteps
							newNextSteps
							previousCostBaseline
							newCostBaseline
						}
					}
				}
				userErrors {
					message
					path
				}
			}
		}`, intake.ID, date(2025, 5, 14).Format(time.RFC3339), "New Scope", "New Next Steps", "New Cost Baseline"), &resp, testhelpers.AddAuthWithAllJobCodesToGraphQLClientTest("WWWW"))

	s.Equal(0, len(resp.CreateSystemIntakeActionExtendLifecycleID.UserErrors))

	respIntake := resp.CreateSystemIntakeActionExtendLifecycleID.SystemIntake
	s.Equal(intake.ID.String(), respIntake.ID)
	s.Equal("2025-05-14T00:00:00Z", respIntake.LcidExpiresAt)
	s.Equal("New Scope", respIntake.LcidScope)
	s.Equal("New Next Steps", respIntake.DecisionNextSteps)
	s.Equal("New Cost Baseline", respIntake.LcidCostBaseline)

	s.Equal(1, len(respIntake.Actions))
	action := respIntake.Actions[0]
	s.Equal("EXTEND_LCID", action.Type)
	s.Equal("wwww Doe", action.Actor.Name)
	s.Equal("WWWW@local.fake", action.Actor.Email)

	s.Equal("2025-05-14T00:00:00Z", action.LcidExpirationChange.NewDate)
	s.Equal("2021-12-01T00:00:00Z", action.LcidExpirationChange.PreviousDate)
	s.Equal("New Scope", action.LcidExpirationChange.NewScope)
	s.Equal("Original Scope", action.LcidExpirationChange.PreviousScope)
	s.Equal("New Next Steps", action.LcidExpirationChange.NewNextSteps)
	s.Equal("Original Next Steps", action.LcidExpirationChange.PreviousNextSteps)
	s.Equal("New Cost Baseline", action.LcidExpirationChange.NewCostBaseline)
	s.Equal("Original Cost Baseline", action.LcidExpirationChange.PreviousCostBaseline)

	// TODO check for dates in returned action
	// TODO verify that email was sent
}

func (s GraphQLTestSuite) TestExtendLifecycleIdRequiresExpirationDate() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:      models.SystemIntakeStatusLCIDISSUED,
		RequestType: models.SystemIntakeRequestTypeNEW,
		EUAUserID:   null.StringFrom("TEST"),
	})
	s.NoError(intakeErr)

	type userErrors []struct {
		Message string
		Path    []string
	}

	var resp struct {
		CreateSystemIntakeActionExtendLifecycleID struct {
			SystemIntake struct {
				ID                string
				LcidExpiresAt     string
				LcidScope         string
				DecisionNextSteps string
				LcidCostBaseline  string
				Lcid              string
			}
			UserErrors userErrors
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			createSystemIntakeActionExtendLifecycleId(input: {
				id: "%s",
				scope: "%s",
				nextSteps: "%s",
			}) {
				systemIntake {
					id
					lcid
					lcidExpiresAt
					lcidScope
					lcidCostBaseline
					decisionNextSteps
				}
				userErrors {
					message
					path
				}
			}
		}`, intake.ID, "Scope", "Next Steps"), &resp)

	s.Empty(resp.CreateSystemIntakeActionExtendLifecycleID.SystemIntake.ID)
	s.Equal(userErrors{{Message: "Must provide a valid future date", Path: []string{"expirationDate"}}}, resp.CreateSystemIntakeActionExtendLifecycleID.UserErrors)
}

func (s GraphQLTestSuite) TestExtendLifecycleIdRequiresScope() {
	ctx := context.Background()

	intake, intakeErr := s.store.CreateSystemIntake(ctx, &models.SystemIntake{
		Status:      models.SystemIntakeStatusLCIDISSUED,
		RequestType: models.SystemIntakeRequestTypeNEW,
		EUAUserID:   null.StringFrom("TEST"),
	})
	s.NoError(intakeErr)

	type userErrors []struct {
		Message string
		Path    []string
	}

	var resp struct {
		CreateSystemIntakeActionExtendLifecycleID struct {
			SystemIntake struct {
				ID                string
				LcidExpiresAt     string
				LcidScope         string
				DecisionNextSteps string
				LcidCostBaseline  string
				Lcid              string
			}
			UserErrors userErrors
		}
	}

	s.client.MustPost(fmt.Sprintf(
		`mutation {
			createSystemIntakeActionExtendLifecycleId(input: {
				id: "%s",
				expirationDate: "%s",
				scope: "%s"
				nextSteps: "%s",
			}) {
				systemIntake {
					id
					lcid
					lcidExpiresAt
					lcidScope
					lcidCostBaseline
					decisionNextSteps
				}
				userErrors {
					message
					path
				}
			}
		}`, intake.ID, date(2025, 5, 14).Format(time.RFC3339), "", "Next Steps"), &resp)

	s.Empty(resp.CreateSystemIntakeActionExtendLifecycleID.SystemIntake.ID)
	s.Equal(userErrors{{Message: "Must provide a non-empty scope", Path: []string{"scope"}}}, resp.CreateSystemIntakeActionExtendLifecycleID.UserErrors)
}
