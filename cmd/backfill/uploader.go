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
	entry.ModelPlan.CreatedBy = princ.ID()

	//TODO make sure to capture all upload errors and store them somewhere
	if entry.ModelPlan.ModelName == "" {
		entry.ModelPlan.ModelName = "unknown" //TODO handle this and log error
		u.Logger.Error("model name is not defined")
	}

	modelPlan, err := resolvers.ModelPlanCreate(&u.Logger, entry.ModelPlan.ModelName, &u.Store, &userInfo, princ)
	if err != nil {
		return err //TODO capture all errors and return collection? Or early return?
	}
	u.Logger.Log(zap.DebugLevel, "created modelPlan "+modelPlan.ModelName) //TODO need better logging?

	retBasics, err := resolvers.PlanBasicsGetByModelPlanID(&u.Logger, modelPlan.ID, &u.Store)
	if err != nil {
		return err //TODO capture all errors and return collection? Or early return?
	}
	entry.PlanBasics.ID = retBasics.ID
	basicChanges := structToMap(entry.PlanBasics)
	// basicChanges := map[string]interface{}{}
	// mapstructure.Decode(entry.PlanBasics, &basicChanges)
	// TODO! Should we just use the store instead of a resolver?\\

	_, err = resolvers.UpdatePlanBasics(&u.Logger, entry.PlanBasics.ID, basicChanges, princ, &u.Store)
	// _, err = u.Store.PlanBasicsUpdate(&u.Logger, entry.PlanBasics)
	if err != nil {
		return err //TODO capture all errors and return collection? Or early return?
	}
	// basics, err := resolvers.UpdatePlanBasics(&u.Logger,)

	retChar, err := resolvers.FetchPlanGeneralCharacteristicsByModelPlanID(&u.Logger, modelPlan.ID, &u.Store)
	if err != nil {
		return err //TODO capture all errors and return collection? Or early return?
	}
	charChanges := structToMap(entry.PlanGeneralCharacteristics)
	_, err = resolvers.UpdatePlanGeneralCharacteristics(&u.Logger, retChar.ID, charChanges, princ, &u.Store)
	if err != nil {
		return err
	}

	//partsAndProv
	retParts, err := resolvers.PlanParticipantsAndProvidersGetByModelPlanID(&u.Logger, modelPlan.ID, &u.Store)
	if err != nil {
		return err
	}
	partsChanges := structToMap(entry.PlanParticipantsAndProviders)
	_, err = resolvers.PlanParticipantsAndProvidersUpdate(&u.Logger, retParts.ID, partsChanges, princ, &u.Store)
	if err != nil {
		return err
	}

	//Beneficiares
	retBene, err := resolvers.PlanBeneficiariesGetByModelPlanID(&u.Logger, modelPlan.ID, &u.Store)
	if err != nil {
		return err
	}

	beneChanges := structToMap(entry.PlanBeneficiaries)
	_, err = resolvers.PlanBeneficiariesUpdate(&u.Logger, retBene.ID, beneChanges, princ, &u.Store)
	if err != nil {
		return err
	}

	//OpsEvalAndLearning
	retOps, err := resolvers.PlanOpsEvalAndLearningGetByModelPlanID(&u.Logger, modelPlan.ID, &u.Store)
	if err != nil {
		return err
	}
	opsChanges := structToMap(entry.PlanOpsEvalAndLearning)
	_, err = resolvers.PlanOpsEvalAndLearningUpdate(&u.Logger, retOps.ID, opsChanges, princ, &u.Store)
	if err != nil {
		return err
	}

	// Plan Payments
	retPay, err := resolvers.PlanPaymentsReadByModelPlan(&u.Logger, &u.Store, modelPlan.ID)
	if err != nil {
		return err
	}
	payChanges := structToMap(entry.PlanPayments)
	_, err = resolvers.PlanPaymentsUpdate(&u.Logger, &u.Store, retPay.ID, payChanges, princ)
	if err != nil {
		return err
	}
	return nil

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
