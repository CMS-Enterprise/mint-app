package main

import (
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

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
)

// Uploader handles functionality for uploading data to the DB
type Uploader struct {
	Store                  storage.Store
	Logger                 zap.Logger
	PossibleUserDictionary *PossibleUserDictionary
}

// NewUploader instantiates an Uploader
func NewUploader(possibleUserDict *PossibleUserDictionary) *Uploader { //TODO make this more configurable if needed
	config := viper.New()
	config.AutomaticEnv()

	store, logger, _, _, _ := getResolverDependencies(config)
	return &Uploader{
		Store:                  *store,
		Logger:                 *logger,
		PossibleUserDictionary: possibleUserDict,
	}

}

func (u *Uploader) uploadEntries(entries []*BackfillEntry) { //TODO add more error handling to this

	for i := 0; i < len(entries); i++ {

		err := u.uploadEntry(entries[i])
		if err != nil {
			u.Logger.Error(err.Error())
		}
	}
}

func (u *Uploader) uploadEntry(entry *BackfillEntry) error {

	userName := entry.ModelPlan.CreatedBy
	user := u.PossibleUserDictionary.tryGetUserByName(userName)
	var princ authentication.Principal
	var userInfo models.UserInfo
	if userName == "" {
		userName = "ANON"
		oktaPrinc := authentication.OKTAPrincipal{
			Username:          userName,
			JobCodeASSESSMENT: false,
			JobCodeUSER:       true,
		}
		princ = &oktaPrinc
		userInfo = models.UserInfo{
			EuaUserID:  userName,
			CommonName: userName,
			Email:      "unknown@mint.cms.gov", //revisit this

		}
	} else {
		oktaPrinc := authentication.OKTAPrincipal{
			Username:          user.EUAID,
			JobCodeASSESSMENT: false,
			JobCodeUSER:       true,
		}
		princ = &oktaPrinc
		userInfo = models.UserInfo{
			EuaUserID:  user.EUAID,
			CommonName: user.Name,
			Email:      models.EmailAddress(user.Email), //revisit this, maybe we do some CEDAR or we redo everything? When we parse, should we note everything we need to look up from CEDAR or something?

		}
	}

	_, uErr := u.uploadModelPlan(entry, princ, userInfo)
	entry.addNonNullUError(uErr) //TODO, should we handle this in the function instead?

	if uErr != nil {
		return fmt.Errorf("error creating a model plan") //return early for this error
	}

	_, uErr = u.uploadPlanBasics(entry, princ)
	entry.addNonNullUError(uErr)

	u.uploadPlanCollaborators(entry, princ)

	// for _, collab := range entry.Collaborators {

	// 	_, uErr = uploadPlanCollaborator(entry, princ,collab)

	// 	entry.addNonNullUError(uErr)

	// }

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

func (u *Uploader) uploadModelPlan(entry *BackfillEntry, princ authentication.Principal, userInfo models.UserInfo) (*models.ModelPlan, *UploadError) {
	entry.ModelPlan.CreatedBy = princ.ID()

	if entry.ModelPlan.ModelName == "" {
		entry.ModelPlan.ModelName = "unknown" //TODO handle this and log error
		u.Logger.Error("model name is not defined")
	}

	modelPlan, err := resolvers.ModelPlanCreate(&u.Logger, entry.ModelPlan.ModelName, &u.Store, &userInfo, princ)
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
	for i, collab := range entry.Collaborators {
		var uErr *UploadError
		collab, uErr = u.uploadPlanCollaborator(entry, princ, collab)

		entry.addNonNullUError(uErr)
		entry.Collaborators[i] = collab //if error, replaced with null..

	}

}

func (u *Uploader) uploadPlanCollaborator(entry *BackfillEntry, princ authentication.Principal, collab *models.PlanCollaborator) (*models.PlanCollaborator, *UploadError) {

	// input := model.PlanCollaboratorCreateInput{
	// 	ModelPlanID: collab.ModelPlanID,
	// 	EuaUserID: collab.EUAUserID,
	// 	FullName: collab.FullName,
	// 	TeamRole: collab.TeamRole,
	// 	Email: collab.Email,

	// }
	// retCollab, err := resolvers.CreatePlanCollaborator(&u.Logger,nil,nil,) // this resolver does a lot... maybe just skip it for now
	//TODO, update the collabs created by, model plan id etc
	collab.CreatedBy = entry.ModelPlan.CreatedBy
	collab.ModelPlanID = entry.ModelPlan.ID
	retCollaborator, err := u.Store.PlanCollaboratorCreate(&u.Logger, collab)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanCollaborator",
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
			DBError: err,
		}
	}
	entry.PlanBasics.ID = retBasics.ID
	basicChanges := structToMap(entry.PlanBasics)

	basics, err := resolvers.UpdatePlanBasics(&u.Logger, entry.PlanBasics.ID, basicChanges, princ, &u.Store)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanBasics",
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
			DBError: err,
		}
	}
	charChanges := structToMap(entry.PlanGeneralCharacteristics)
	char, err := resolvers.UpdatePlanGeneralCharacteristics(&u.Logger, retChar.ID, charChanges, princ, &u.Store)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanGeneralCharacteristics",
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
			DBError: err,
		}
	}
	partsChanges := structToMap(entry.PlanParticipantsAndProviders)
	planParticipantsAndProviders, err := resolvers.PlanParticipantsAndProvidersUpdate(&u.Logger, retParts.ID, partsChanges, princ, &u.Store)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanParticipantsAndProviders",
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
			DBError: err,
		}
	}

	beneChanges := structToMap(entry.PlanBeneficiaries)
	planBeneficiaries, err := resolvers.PlanBeneficiariesUpdate(&u.Logger, retBene.ID, beneChanges, princ, &u.Store)

	if err != nil {
		return nil, &UploadError{
			Model:   "PlanBeneficiaries",
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
			DBError: err,
		}
	}
	opsChanges := structToMap(entry.PlanOpsEvalAndLearning)
	planOpsEvalAndLearning, err := resolvers.PlanOpsEvalAndLearningUpdate(&u.Logger, retOps.ID, opsChanges, princ, &u.Store)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanOpsEvalAndLearning",
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
			DBError: err,
		}
	}
	payChanges := structToMap(entry.PlanPayments)
	planPayments, err := resolvers.PlanPaymentsUpdate(&u.Logger, &u.Store, retPay.ID, payChanges, princ)
	if err != nil {
		return nil, &UploadError{
			Model:   "PlanPayments",
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
	logger, _ := zap.NewDevelopment()

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
