package models

import (
	"time"
)

// DateHistogramAggregationResponse represents the response from an Elasticsearch date histogram aggregation
type DateHistogramAggregationResponse struct {
	Aggregations struct {
		ChangesOverTime struct {
			Buckets []RawDateHistogramAggregationBucket `json:"buckets"`
		} `json:"changes_over_time"`
	} `json:"aggregations"`
}

// DateHistogramAggregationBucket represents a bucket from an Elasticsearch date histogram aggregation
type DateHistogramAggregationBucket struct {
	Key            string    `json:"key"`
	DocCount       int       `json:"doc_count"`
	MaxModifiedDts time.Time `json:"max_modified_dts"`
	MinModifiedDts time.Time `json:"min_modified_dts"`
}

// NewDateHistogramAggregationBucketFromRaw creates a new
// DateHistogramAggregationBucket object from the given raw bucket
func NewDateHistogramAggregationBucketFromRaw(rawBucket *RawDateHistogramAggregationBucket) (
	*DateHistogramAggregationBucket,
	error,
) {
	maxDts, err := time.Parse(time.RFC3339, rawBucket.MaxModifiedDts.ValueAsString)
	if err != nil {
		return nil, err
	}

	minDts, err := time.Parse(time.RFC3339, rawBucket.MinModifiedDts.ValueAsString)
	if err != nil {
		return nil, err
	}

	return &DateHistogramAggregationBucket{
		Key:            rawBucket.Key,
		DocCount:       rawBucket.DocCount,
		MaxModifiedDts: maxDts,
		MinModifiedDts: minDts,
	}, nil
}

// RawDateHistogramAggregationBucket represents a raw bucket from an Elasticsearch date histogram aggregation
type RawDateHistogramAggregationBucket struct {
	Key            string `json:"key"`
	DocCount       int    `json:"doc_count"`
	MaxModifiedDts struct {
		Value         float64 `json:"value"`
		ValueAsString string  `json:"value_as_string"`
	} `json:"max_modified_dts"`
	MinModifiedDts struct {
		Value         float64 `json:"value"`
		ValueAsString string  `json:"value_as_string"`
	} `json:"min_modified_dts"`
}
