package resolvers

/*
import (
	"bytes"
	"context"
	"errors"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/elastic/go-elasticsearch/v8/esapi"
	"github.com/stretchr/testify/mock"
	"io"
)

type mockESClient struct {
	mock.Mock
}

func newMockEsClient() *mockESClient {
	return &mockESClient{}
}

func (m *mockESClient) Search(ctx context.Context, query model.ElasticsearchQuery, limit int, offset int) ([]*models.ChangeTableRecord, error) {
	args := m.Called(ctx, query, limit, offset)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*models.ChangeTableRecord), args.Error(1)
}

func (suite *ResolverSuite) TestSearchChangeTable() {
	query := createSearchQuery()

	esClient := newMockEsClient()
	res := createSuccessResponse()

	esClient.On("Search", mock.Anything, mock.Anything, mock.Anything, mock.Anything).Return(res, nil)

	searchResponse, err := SearchChangeTable(suite.testConfigs.Logger, esClient, &query, nil, nil)
	suite.NoError(err)
	suite.Equal(1, searchResponse.Total)
	suite.Len(searchResponse.Hits, 1)

	hit := searchResponse.Hits[0]
	suite.Equal("1", hit.ID)
	suite.Equal("value", hit.Source["field"])
}

func (suite *ResolverSuite) TestSearchChangeTableError() {
	query := createSearchQuery()

	esClient := newMockEsClient()
	esClient.On("Search", mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything).Return(esapi.Response{}, errors.New("search error"))

	_, err := SearchChangeTable(suite.testConfigs.Logger, esClient, &query, nil, nil)
	suite.Error(err)
}

func (suite *ResolverSuite) TestSearchChangeTableResponseError() {
	query := createSearchQuery()

	esClient := newMockEsClient()
	res := createErrorResponse()

	esClient.On("Search", mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything).Return(res, nil)

	_, err := SearchChangeTable(suite.testConfigs.Logger, esClient, &query, nil, nil)
	suite.Error(err)
}

// Helper methods

func createSearchQuery() model.ElasticsearchQuery {
	return model.ElasticsearchQuery{
		Query: map[string]interface{}{
			"match": map[string]interface{}{
				"field": "value",
			},
		},
	}
}

func createErrorResponse() esapi.Response {
	return esapi.Response{
		StatusCode: 400,
		Body: io.NopCloser(bytes.NewReader([]byte(`{
			"error": {
				"type": "search_phase_execution_exception",
				"reason": "all shards failed"
			},
			"status": 400
		}`))),
	}
}

func createSuccessResponse() esapi.Response {
	return esapi.Response{
		StatusCode: 200,
		Body: io.NopCloser(bytes.NewReader([]byte(`{
			"_shards": {
				"total": 1,
				"successful": 1,
				"skipped": 0,
				"failed": 0
			},
			"hits": {
				"total": {
					"value": 1,
					"relation": "eq"
				},
				"max_score": 1.0,
				"hits": [
					{
						"_index": "test",
						"_type": "_doc",
						"_id": "1",
						"_score": 1.0,
						"_source": {
							"field": "value"
						}
					}
				]
			}
		}`))),
	}
}
*/
