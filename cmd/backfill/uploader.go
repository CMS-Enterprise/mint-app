package main

import (
	"context"
	"fmt"
	"log"

	"github.com/mitchellh/mapstructure"
	"github.com/spf13/viper"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/appconfig"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/graph/resolvers"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"
	"github.com/cmsgov/mint-app/pkg/storage"
	"github.com/cmsgov/mint-app/pkg/upload"
	"github.com/cmsgov/mint-app/pkg/userhelpers"

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
)

// Uploader handles functionality for uploading data to the DB
type Uploader struct {
	Store      storage.Store
	Logger     zap.Logger
	Backfiller *Backfiller
}

// NewUploader instantiates an Uploader
func NewUploader(backfiller *Backfiller) *Uploader { //TODO make this more configurable if needed
	config := viper.New()
	config.AutomaticEnv()

	store, logger, _, _, _ := getResolverDependencies(config)
	return &Uploader{
		Store:      *store,
		Logger:     *logger,
		Backfiller: backfiller,
	}

}

func (u *Uploader) uploadEntries(entries []*BackfillEntry) { //TODO add more error handling to this
	fmt.Printf("BeginingDataUpload \n")

	for i := 0; i < len(entries); i++ {

		err := u.uploadEntry(entries[i])
		if err != nil {
			u.Logger.Error(err.Error())
		}
	}
}

func (u *Uploader) uploadEntry(entry *BackfillEntry) error {
	fmt.Printf("Uploading model : %q \n", entry.ModelPlan.ModelName)

	userName := entry.ModelPlan.CreatedBy
	user := u.Backfiller.UDictionary.tryGetUserByName(userName) //TODO create an account AFTER WE ADD A USER
	creatorAccount, err := userhelpers.GetOrCreateUserAccount(context.Background(), &u.Store, user.EUAID, false, false, backfillUserWrapperAccountInfoFunc(context.Background(), user.EUAID, user))

	if err != nil {
		return fmt.Errorf("unable to get account for " + userName)
	}
	var princ authentication.Principal
	if userName == "" {
		userName = "ANON"
		oktaPrinc := authentication.ApplicationPrincipal{
			Username:          userName,
			JobCodeASSESSMENT: false,
			JobCodeUSER:       true,
			UserAccount:       creatorAccount,
		}
		princ = &oktaPrinc
	} else {
		oktaPrinc := authentication.ApplicationPrincipal{
			Username:          user.EUAID,
			JobCodeASSESSMENT: false,
			JobCodeUSER:       true,
			UserAccount:       creatorAccount,
		}
		princ = &oktaPrinc
	}

	_, uErr := u.uploadModelPlan(entry, princ, user)
	entry.addNonNullUError(uErr)

	if uErr != nil {
		return fmt.Errorf("error creating a model plan") //return early for this error
	}

	_, uErr = u.uploadPlanBasics(entry, princ)
	entry.addNonNullUError(uErr)

	u.uploadPlanCollaborators(entry, princ)

	_, uErr = u.uploadPlanGeneralCharacteristics(entry, princ)
	entry.addNonNullUError(uErr)

	_, uErr = u.uploadPlanGeneralCharacteristics(entry, princ)
	entry.addNonNullUError(uErr)

	_, uErr = u.uploadPlanParticipantsAndProviders(entry, princ)
	entry.addNonNullUError(uErr)

	_, uErr = u.uploadPlanBeneficiaries(entry, princ)
	entry.addNonNullUError(uErr)

	_, uErr = u.uploadPlanOpsEvalAndLearning(entry, princ)
	entry.addNonNullUError(uErr)

	_, uErr = u.uploadPlanPayments(entry, princ)
	entry.addNonNullUError(uErr)
	return nil

}

func (u *Uploader) uploadModelPlan(entry *BackfillEntry, princ authentication.Principal, user *PossibleUser) (*models.ModelPlan, *UploadError) {
	entry.ModelPlan.CreatedBy = princ.ID()

	if entry.ModelPlan.ModelName == "" {
		entry.ModelPlan.ModelName = "unknown" //TODO handle this and log error
		u.Logger.Error("model name is not defined")
	}

	modelPlan, err := resolvers.ModelPlanCreate(context.Background(), &u.Logger, entry.ModelPlan.ModelName, &u.Store, princ, backfillUserWrapperAccountInfoFunc(context.Background(), user.Name, user))
	if err != nil {
		return nil, &UploadError{
			Model:   "ModelPLan",
			DBError: err,
		}
	}
	entry.ModelPlan = modelPlan
	u.Logger.Log(zap.DebugLevel, "created modelPlan "+modelPlan.ModelName) //TODO need better logging?
	return modelPlan, nil
}

func (u *Uploader) uploadPlanCollaborators(entry *BackfillEntry, princ authentication.Principal) {
	for _, simpleCollab := range entry.SimplifiedCollaborators {
		var uErr *UploadError
		collab, uErr := u.uploadPlanCollaborator(entry, princ, simpleCollab)

		entry.addNonNullUError(uErr)
		entry.Collaborators = append(entry.Collaborators, collab) //if error, replaced with null..

	}

}

func (u *Uploader) uploadPlanCollaborator(entry *BackfillEntry, princ authentication.Principal, sCollab *SimplifiedCollaborator) (*models.PlanCollaborator, *UploadError) {

	user := u.Backfiller.UDictionary.tryGetUserByName(sCollab.Name)

	collabAccount, err := userhelpers.GetOrCreateUserAccount(context.Background(), &u.Store, user.EUAID, false, false, backfillUserWrapperAccountInfoFunc(context.Background(), user.EUAID, user))
	if err != nil {
		return nil, &UploadError{
			Model:   "UserAccount",
			Message: err.Error(),
			DBError: err,
		}
	}
	collab := models.NewPlanCollaborator(princ.Account().ID, entry.ModelPlan.ID, collabAccount.ID, sCollab.Role)
	_, favErr := resolvers.PlanFavoriteCreate(&u.Logger, princ, collab.UserID, &u.Store, entry.ModelPlan.ID)
	if favErr != nil {
		return nil, &UploadError{
			Model:   "PlanCollaborator",
			Message: favErr.Error(),
			DBError: favErr,
		}
	}

	retCollaborator, err := u.Store.PlanCollaboratorCreate(&u.Logger, collab)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanCollaborator",
			Message: err.Error(),
			DBError: err,
		}
	}
	return retCollaborator, nil
}

func (u *Uploader) uploadPlanBasics(entry *BackfillEntry, princ authentication.Principal) (*models.PlanBasics, *UploadError) {
	retBasics, err := resolvers.PlanBasicsGetByModelPlanID(&u.Logger, entry.ModelPlan.ID, &u.Store)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanBasics",
			Message: err.Error(),
			DBError: err,
		}
	}
	entry.PlanBasics.ID = retBasics.ID
	basicChanges := structToMap(entry.PlanBasics)

	basics, err := resolvers.UpdatePlanBasics(&u.Logger, entry.PlanBasics.ID, basicChanges, princ, &u.Store)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanBasics",
			Message: err.Error(),
			DBError: err,
		}
	}
	entry.PlanBasics = basics
	return basics, nil
}
func (u *Uploader) uploadPlanGeneralCharacteristics(entry *BackfillEntry, princ authentication.Principal) (*models.PlanGeneralCharacteristics, *UploadError) {
	retChar, err := resolvers.FetchPlanGeneralCharacteristicsByModelPlanID(&u.Logger, entry.ModelPlan.ID, &u.Store)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanGeneralCharacteristics",
			Message: err.Error(),
			DBError: err,
		}
	}
	charChanges := structToMap(entry.PlanGeneralCharacteristics)
	char, err := resolvers.UpdatePlanGeneralCharacteristics(&u.Logger, retChar.ID, charChanges, princ, &u.Store)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanGeneralCharacteristics",
			Message: err.Error(),
			DBError: err,
		}
	}
	entry.PlanGeneralCharacteristics = char
	return char, nil
}

func (u *Uploader) uploadPlanParticipantsAndProviders(entry *BackfillEntry, princ authentication.Principal) (*models.PlanParticipantsAndProviders, *UploadError) {

	retParts, err := resolvers.PlanParticipantsAndProvidersGetByModelPlanID(&u.Logger, entry.ModelPlan.ID, &u.Store)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanParticipantsAndProviders",
			Message: err.Error(),
			DBError: err,
		}
	}
	partsChanges := structToMap(entry.PlanParticipantsAndProviders)
	planParticipantsAndProviders, err := resolvers.PlanParticipantsAndProvidersUpdate(&u.Logger, retParts.ID, partsChanges, princ, &u.Store)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanParticipantsAndProviders",
			Message: err.Error(),
			DBError: err,
		}
	}
	entry.PlanParticipantsAndProviders = planParticipantsAndProviders
	return planParticipantsAndProviders, nil
}
func (u *Uploader) uploadPlanBeneficiaries(entry *BackfillEntry, princ authentication.Principal) (*models.PlanBeneficiaries, *UploadError) {

	retBene, err := resolvers.PlanBeneficiariesGetByModelPlanID(&u.Logger, entry.ModelPlan.ID, &u.Store)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanBeneficiaries",
			Message: err.Error(),
			DBError: err,
		}
	}

	beneChanges := structToMap(entry.PlanBeneficiaries)
	planBeneficiaries, err := resolvers.PlanBeneficiariesUpdate(&u.Logger, retBene.ID, beneChanges, princ, &u.Store)

	if err != nil {
		return nil, &UploadError{
			Model:   "PlanBeneficiaries",
			Message: err.Error(),
			DBError: err,
		}
	}
	entry.PlanBeneficiaries = planBeneficiaries
	return planBeneficiaries, nil
}
func (u *Uploader) uploadPlanOpsEvalAndLearning(entry *BackfillEntry, princ authentication.Principal) (*models.PlanOpsEvalAndLearning, *UploadError) {
	retOps, err := resolvers.PlanOpsEvalAndLearningGetByModelPlanID(&u.Logger, entry.ModelPlan.ID, &u.Store)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanOpsEvalAndLearning",
			Message: err.Error(),
			DBError: err,
		}
	}
	opsChanges := structToMap(entry.PlanOpsEvalAndLearning)
	planOpsEvalAndLearning, err := resolvers.PlanOpsEvalAndLearningUpdate(&u.Logger, retOps.ID, opsChanges, princ, &u.Store)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanOpsEvalAndLearning",
			Message: err.Error(),
			DBError: err,
		}
	}
	entry.PlanOpsEvalAndLearning = planOpsEvalAndLearning
	return planOpsEvalAndLearning, nil
}
func (u *Uploader) uploadPlanPayments(entry *BackfillEntry, princ authentication.Principal) (*models.PlanPayments, *UploadError) {
	retPay, err := resolvers.PlanPaymentsReadByModelPlan(&u.Logger, &u.Store, entry.ModelPlan.ID)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanPayments",
			Message: err.Error(),
			DBError: err,
		}
	}
	payChanges := structToMap(entry.PlanPayments)
	planPayments, err := resolvers.PlanPaymentsUpdate(&u.Logger, &u.Store, retPay.ID, payChanges, princ)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanPayments",
			Message: err.Error(),
			DBError: err,
		}
	}

	entry.PlanPayments = planPayments
	return planPayments, nil
}

func structToMap(obj interface{}) map[string]interface{} {

	mObj := map[string]interface{}{}

	dec, err := mapstructure.NewDecoder(&mapstructure.DecoderConfig{
		ErrorUnused: true,
		TagName:     "json",
		Result:      &mObj,
		ZeroFields:  true,
		Squash:      true,
	})
	if err != nil {
		log.Default().Print("issue making a map decoder ")
	}

	err = dec.Decode(obj)
	if err != nil {
		log.Default().Print("issue decoding map ")
	}

	return mObj

}

// getResolverDependencies takes a Viper config and returns a Store and Logger object to be used
// by various resolver functions.
func getResolverDependencies(config *viper.Viper) (
	*storage.Store,
	*zap.Logger,
	*upload.S3Client, //TODO isd this needed?
	oddmail.EmailService,
	email.TemplateService,
) {
	// Create the logger
	logger := zap.NewNop()

	// Create LD Client, which is required for creating the store
	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	if err != nil {
		panic(err)
	}

	// Create the DB Config & Store
	dbConfig := storage.DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}
	store, err := storage.NewStore(logger, dbConfig, ldClient)
	if err != nil {
		fmt.Printf("Failed to get new database: %v", err)
		panic(err)
	}

	// Create S3 client
	s3Cfg := upload.Config{
		Bucket:  config.GetString(appconfig.AWSS3FileUploadBucket),
		Region:  config.GetString(appconfig.AWSRegion),
		IsLocal: true,
	}

	s3Client := upload.NewS3Client(s3Cfg)

	return store, logger, &s3Client, nil, nil
}
