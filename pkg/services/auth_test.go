package services

import (
	"context"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
)

func (s *ServicesTestSuite) TestHasRole() {
	fnAuth := HasRole
	nonAdmin := authentication.EUAPrincipal{EUAID: "FAKE", JobCodeMINT: true, JobCodeADMIN: false}
	yesADMIN := authentication.EUAPrincipal{EUAID: "FAKE", JobCodeMINT: true, JobCodeADMIN: true}

	testCases := map[string]struct {
		ctx     context.Context
		allowed bool
	}{
		"anonymous": {
			ctx:     context.Background(),
			allowed: false,
		},
		"non admin": {
			ctx:     appcontext.WithPrincipal(context.Background(), &nonAdmin),
			allowed: false,
		},
		"has admin": {
			ctx:     appcontext.WithPrincipal(context.Background(), &yesADMIN),
			allowed: true,
		},
	}

	for name, tc := range testCases {
		s.Run(name, func() {
			ok, err := fnAuth(tc.ctx, model.RoleMintAdminUser)
			s.NoError(err)
			s.Equal(tc.allowed, ok)
		})
	}
}
