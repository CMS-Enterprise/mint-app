package services

import (
	"context"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
)

func (s *ServicesTestSuite) TestHasRole() {
	fnAuth := HasRole
	userPrincipal := authentication.ApplicationPrincipal{Username: "FAKE", JobCodeUSER: true, JobCodeASSESSMENT: false}
	assessmentPrincipal := authentication.ApplicationPrincipal{Username: "FAKE", JobCodeUSER: false, JobCodeASSESSMENT: true}

	testCases := map[string]struct {
		ctx     context.Context
		allowed bool
	}{
		"anonymous": {
			ctx:     context.Background(),
			allowed: false,
		},
		"non admin": {
			ctx:     appcontext.WithPrincipal(context.Background(), &userPrincipal),
			allowed: false,
		},
		"has admin": {
			ctx:     appcontext.WithPrincipal(context.Background(), &assessmentPrincipal),
			allowed: true,
		},
	}

	for name, tc := range testCases {
		s.Run(name, func() {
			ok, err := fnAuth(tc.ctx, model.RoleMintAssessment)
			s.NoError(err)
			s.Equal(tc.allowed, ok)
		})
	}
}
