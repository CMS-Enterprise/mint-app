package flags

import (
	"context"
	"crypto/sha256"
	"fmt"
	"time"

	"github.com/launchdarkly/go-sdk-common/v3/ldcontext"
	ld "github.com/launchdarkly/go-server-sdk/v6"
	"github.com/launchdarkly/go-server-sdk/v6/ldfiledata"
	"github.com/launchdarkly/go-server-sdk/v6/ldfilewatch"

	"github.com/cms-enterprise/mint-app/pkg/appconfig"
	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

// LDEChimpEnabledKey is the key for retrieving the bool if echimp is enabled to grab from S3
const LDEChimpEnabledKey = "echimpEnabled"

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

// NewLaunchDarklyClient returns a client backed by Launch Darkly
func NewLaunchDarklyClient(config Config) (*ld.LDClient, error) {
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
func GetBool(principal authentication.Principal, ldClient *ld.LDClient, key string, defaultValue bool) (bool, error) {
	ldContext := LDContext(principal)

	return ldClient.BoolVariation(key, ldContext, defaultValue)
}
