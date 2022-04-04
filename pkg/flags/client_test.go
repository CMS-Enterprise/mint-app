package flags

import (
	"context"
	"crypto/sha256"
	appcontext2 "github.com/cmsgov/mint-app/pkg/shared/appcontext"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/cmsgov/mint-app/pkg/authentication"
)

func TestPrincipal(t *testing.T) {
	testCases := map[string]struct {
		ctx  context.Context
		anon bool
	}{
		"anonymous": {
			context.Background(),
			true,
		},
		"disempowered": {
			appcontext2.ProvideWithSecurityPrincipal(
				context.Background(),
				&authentication.EUAPrincipal{EUAID: "WEAK"},
			),
			true,
		},
		"submitter": {
			appcontext2.ProvideWithSecurityPrincipal(
				context.Background(),
				&authentication.EUAPrincipal{EUAID: "MINT", JobCodeMINT: true},
			),
			false,
		},
		"reviewer": {
			appcontext2.ProvideWithSecurityPrincipal(
				context.Background(),
				&authentication.EUAPrincipal{EUAID: "BOSS", JobCodeADMIN: true},
			),
			false,
		},
	}

	for name, tc := range testCases {
		t.Run(name, func(t *testing.T) {
			base := appcontext2.GetContextPrincipal(tc.ctx)

			lduser := Principal(tc.ctx)

			assert.Equal(t, tc.anon, lduser.GetAnonymous())
			assert.NotEqual(t, base.ID(), lduser.GetKey())
			assert.Equal(t, len(lduser.GetKey()), sha256.Size*2)
			// t.Logf("key: %s\n", lduser.GetKey())
		})
	}
}
