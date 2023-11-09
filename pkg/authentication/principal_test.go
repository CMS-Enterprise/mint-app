package authentication

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestPrincipal(t *testing.T) {
	// Arrange
	id := fmt.Sprintf("%X", time.Now())

	testCases := map[string]struct {
		p                     Principal
		expectID              string
		expectAllowUser       bool
		expectAllowAssessment bool
		expectAllowNonCMS     bool
	}{
		"anonymous is unauthorized": {
			p:                     ANON,
			expectID:              anonID,
			expectAllowUser:       false,
			expectAllowAssessment: false,
			expectAllowNonCMS:     false,
		},
		"regular eua user": {
			p: &ApplicationPrincipal{
				Username:          id,
				JobCodeUSER:       true,
				JobCodeASSESSMENT: false,
				JobCodeNonCMS:     false,
			},
			expectID:              id,
			expectAllowUser:       true,
			expectAllowAssessment: false,
			expectAllowNonCMS:     false,
		},
		"assessment user": {
			p: &ApplicationPrincipal{
				Username:          id,
				JobCodeUSER:       false,
				JobCodeASSESSMENT: true,
				JobCodeNonCMS:     false,
			},
			expectID:              id,
			expectAllowUser:       false,
			expectAllowAssessment: true,
			expectAllowNonCMS:     false,
		},
		"non-cms user only": {
			p: &ApplicationPrincipal{
				Username:          id,
				JobCodeUSER:       false,
				JobCodeASSESSMENT: false,
				JobCodeNonCMS:     true,
			},
			expectID:              id,
			expectAllowUser:       false,
			expectAllowAssessment: false,
			expectAllowNonCMS:     true,
		},
		"both user and assessment": {
			p: &ApplicationPrincipal{
				Username:          id,
				JobCodeUSER:       true,
				JobCodeASSESSMENT: true,
				JobCodeNonCMS:     false,
			},
			expectID:              id,
			expectAllowUser:       true,
			expectAllowAssessment: true,
			expectAllowNonCMS:     false,
		},
		"both user and non-cms": {
			p: &ApplicationPrincipal{
				Username:          id,
				JobCodeUSER:       true,
				JobCodeASSESSMENT: false,
				JobCodeNonCMS:     true,
			},
			expectID:              id,
			expectAllowUser:       true,
			expectAllowAssessment: false,
			expectAllowNonCMS:     true,
		},
	}

	for name, tc := range testCases {
		t.Run(name, func(t *testing.T) {
			// Act - not needed

			//Assert
			assert.NotEmpty(t, tc.p.String(), "fmt.Stringer")
			assert.NotEmpty(t, tc.p.ID(), "ID()")
			assert.Equal(t, tc.expectID, tc.p.ID(), "ID()")
			assert.Equal(t, tc.expectAllowUser, tc.p.AllowUSER(), "AllowUSER()")
			assert.Equal(t, tc.expectAllowAssessment, tc.p.AllowASSESSMENT(), "AllowASSESSMENT()")
		})
	}
}
