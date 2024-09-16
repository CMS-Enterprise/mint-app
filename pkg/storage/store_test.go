package storage

import (
	"fmt"
	"testing"
	"time"

	"github.com/facebookgo/clock"
	"github.com/jmoiron/sqlx"
	ld "github.com/launchdarkly/go-server-sdk/v6"
	_ "github.com/lib/pq" // required for postgres driver in sqlx
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/testhelpers"
)

type StoreTestSuite struct {
	suite.Suite
	db        *sqlx.DB
	logger    *zap.Logger
	store     *Store
	principal *authentication.ApplicationPrincipal
}

// EqualTime uses time.Time's Equal() to check for equality
// and wraps failures with useful error messages.
func (s *StoreTestSuite) EqualTime(expected, actual time.Time) {
	if !actual.Equal(expected) {
		s.Failf("times were not equal", "expected %v, got %v", expected, actual)
	}
}

func TestStoreTestSuite(t *testing.T) {
	config := testhelpers.NewConfig()

	logger := zap.NewNop()
	dbConfig := DBConfig{
		Host:           config.GetString(appconfig.DBHostConfigKey),
		Port:           config.GetString(appconfig.DBPortConfigKey),
		Database:       config.GetString(appconfig.DBNameConfigKey),
		Username:       config.GetString(appconfig.DBUsernameConfigKey),
		Password:       config.GetString(appconfig.DBPasswordConfigKey),
		SSLMode:        config.GetString(appconfig.DBSSLModeConfigKey),
		MaxConnections: config.GetInt(appconfig.DBMaxConnections),
	}

	ldClient, err := ld.MakeCustomClient("fake", ld.Config{Offline: true}, 0)
	assert.NoError(t, err)

	store, err := NewStore(dbConfig, ldClient)
	if err != nil {
		fmt.Printf("Failed to get new database: %v", err)
		t.Fail()
	}
	store.clock = clock.NewMock()
	princ, err := getTestPrincipal(store, "TestSuiteUserAccount")
	assert.NoError(t, err)

	storeTestSuite := &StoreTestSuite{
		Suite:     suite.Suite{},
		db:        store.db,
		logger:    logger,
		store:     store,
		principal: princ,
	}

	suite.Run(t, storeTestSuite)
}

// getTestPrincipal either inserts a new user account record into the database, or returns the record already in the database
func getTestPrincipal(store *Store, userName string) (*authentication.ApplicationPrincipal, error) {
	userAccount, accErr := UserAccountGetByUsername(store, userName)
	if accErr != nil {
		return nil, accErr
	}
	if userAccount != nil {
		return &authentication.ApplicationPrincipal{
			Username:          *userAccount.Username,
			JobCodeUSER:       true,
			JobCodeASSESSMENT: true,
			JobCodeMAC:        false,
			JobCodeNonCMS:     false,
			UserAccount:       userAccount,
		}, nil
	}
	// we mock a user account to the DB directly here
	userAccount = &authentication.UserAccount{
		Username:    models.StringPointer(userName),
		IsEUAID:     true,
		CommonName:  "testTestTest",
		Locale:      "testTestTest",
		Email:       "testTestTest",
		GivenName:   "testTestTest",
		FamilyName:  "testTestTest",
		ZoneInfo:    "testTestTest",
		HasLoggedIn: true,
	}

	newAccount, newErr := sqlutils.WithTransaction[authentication.UserAccount](store, func(tx *sqlx.Tx) (*authentication.UserAccount, error) {
		newAccount, newErr := UserAccountInsertByUsername(tx, userAccount)
		if newErr != nil {
			return nil, newErr
		}
		pref := models.NewUserNotificationPreferences(newAccount.ID)

		_, preferencesErr := UserNotificationPreferencesCreate(tx, pref)
		if preferencesErr != nil {
			return nil, preferencesErr
		}
		return newAccount, nil

	})
	if newErr != nil {
		return nil, newErr
	}
	// return newAccount, nil

	princ := &authentication.ApplicationPrincipal{
		Username:          *newAccount.Username,
		JobCodeUSER:       true,
		JobCodeASSESSMENT: true,
		JobCodeMAC:        false,
		JobCodeNonCMS:     false,
		UserAccount:       newAccount,
	}
	return princ, nil

}
