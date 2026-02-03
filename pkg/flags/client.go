package flags

import (
	"context"
	"crypto/sha256"
	"fmt"
	"strconv"
	"sync"
	"time"

	"github.com/launchdarkly/go-sdk-common/v3/ldcontext"
	ld "github.com/launchdarkly/go-server-sdk/v6"
	"github.com/launchdarkly/go-server-sdk/v6/ldfiledata"
	"github.com/launchdarkly/go-server-sdk/v6/ldfilewatch"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

var (
	ldClient     *ld.LDClient
	ldClientOnce sync.Once
)

func GetLDClient() *ld.LDClient {
	ldClientOnce.Do(func() {
		l, err := newLaunchDarklyClient()
		if err != nil {
			panic(fmt.Errorf("problem initializing LD client: %w", err))
		}

		ldClient = l
	})

	return ldClient
}

// DowngradeAssessmentTeamKey is the Flag Key in LaunchDarkly for downgrading assessment team users
const DowngradeAssessmentTeamKey = "downgradeAssessmentTeam"

// DowngradeNonCMSKey is the Flag Key in LaunchDarkly for downgrading users with the NON-CMS job code
const DowngradeNonCMSKey = "downgradeNonCMS"

// Config has all the parts for creating a new LD Client
type Config struct {
	Source         appconfig.FlagSourceOption
	Key            string
	Timeout        time.Duration
	FlagValuesFile string
}

func newFlagConfig() Config {
	flagSourceVal := getRequired(appconfig.FlagSourceKey)

	flagSource := appconfig.FlagSourceOption(flagSourceVal)

	var timeout time.Duration
	var key string
	var flagValuesFile string

	switch flagSource {
	case appconfig.FlagSourceLocal:
		timeout = 0
		key = "local-has-no-key"
	case appconfig.FlagSourceLaunchDarkly:
		timeout = time.Duration(getRequiredInt(appconfig.LDTimeout)) * time.Second
		key = getRequired(appconfig.LDKey)
	case appconfig.FlagSourceFile:
		flagValuesFile = getRequired(appconfig.FlagValuesFileKey)
	default:
		opts := []appconfig.FlagSourceOption{
			appconfig.FlagSourceLocal,
			appconfig.FlagSourceLaunchDarkly,
			appconfig.FlagSourceFile,
		}

		panic(fmt.Sprintf("%[1]s must be set to one of the following: %[2]v", appconfig.FlagSourceFile, opts))
	}

	return Config{
		Source:         flagSource,
		Key:            key,
		Timeout:        timeout,
		FlagValuesFile: flagValuesFile,
	}
}

// newLaunchDarklyClient returns a client backed by Launch Darkly
func newLaunchDarklyClient() (*ld.LDClient, error) {
	config := newFlagConfig()
	if config.Source == appconfig.FlagSourceLaunchDarkly {
		return ld.MakeClient(config.Key, config.Timeout)
	}

	defaultTimeout := 5 * time.Second

	if config.Source == appconfig.FlagSourceFile {

		ldConfig := ld.Config{
			DataSource: ldfiledata.DataSource().FilePaths(config.FlagValuesFile).Reloader(ldfilewatch.WatchFiles),
		}
		return ld.MakeCustomClient("fake_key", ldConfig, defaultTimeout)
	}

	// we default to an OFFLINE client for non-deployed environments
	return ld.MakeCustomClient("fake_offline_key", ld.Config{Offline: true}, 5*time.Second)
}

// Principal builds the LaunchDarkly user object for the
// currently authenticated principal.
func Principal(ctx context.Context) ldcontext.Context {
	p := appcontext.Principal(ctx)
	return LDContext(p)
}

// LDContext returns the context from launch darkly for a given principal
func LDContext(principal authentication.Principal) ldcontext.Context {
	key := ContextKeyForID(principal.ID())

	// this is a bit of a loose inference, assuming a user w/o Job Codes
	// is an Anonymous user. Over time, may want to consider adding
	// a `func Anonymous() bool` accessor to the authorizaion.Principal interface
	// definition instead of doing this inference
	authed := (principal.AllowUSER() || principal.AllowASSESSMENT())

	return ldcontext.
		NewBuilder(key).
		Anonymous(!authed).
		Build()

}

// ContextKeyForID generates a context key from an ID
// we should not be using bare EUA IDs as identifiers to
// LaunchDarkly (per Jimil/ISSO), so we use a cryptographically
// secure one-way hash of the EUA ID as "key" for the LD Context object.
func ContextKeyForID(id string) string {
	h := sha256.New()
	_, _ = h.Write([]byte(id))
	return fmt.Sprintf("%x", h.Sum(nil))
}

// GetBool fetches a bool from Launch Darkly
func GetBool(ldClient *ld.LDClient, principal authentication.Principal, key string, defaultValue bool) (bool, error) {
	ldContext := LDContext(principal)

	return ldClient.BoolVariation(key, ldContext, defaultValue)
}

func getRequired(key string) string {
	return appconfig.MustGetRequired(key)
}

func getRequiredInt(key string) int {
	v := appconfig.MustGetRequired(key)
	i, err := strconv.Atoi(v)
	if err != nil {
		panic(fmt.Errorf("unable to convert %[1]s to int for key %[2]s: %[3]w", v, key, err))
	}

	return i
}
