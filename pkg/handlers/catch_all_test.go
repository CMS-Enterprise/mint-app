package handlers

import (
	"bytes"
	"context"
	"net/http"
	"net/http/httptest"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
)

func (s *HandlerTestSuite) TestCatchAllHandler() {
	s.Run("catch all handler always returns 404", func() {
		rr := httptest.NewRecorder()
		ctx := appcontext.WithLogger(context.Background(), s.logger)
		req, err := http.NewRequest("GET", "/notAURL", bytes.NewBufferString(""))
		req = req.WithContext(ctx)
		s.NoError(err)
		CatchAllHandler{
			HandlerBase: s.base,
		}.Handle()(rr, req)
		s.Equal(http.StatusNotFound, rr.Code)
	})
}
