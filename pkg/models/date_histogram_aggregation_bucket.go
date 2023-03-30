package models

import (
	"time"
)

type DateHistogramAggregationBucket struct {
	Key            string    `json:"key"`
	DocCount       int       `json:"doc_count"`
	MaxModifiedDts time.Time `json:"max_modified_dts"`
	MinModifiedDts time.Time `json:"min_modified_dts"`
}
