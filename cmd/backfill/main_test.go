package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBackfill(t *testing.T) {
	if testing.Short() {
		t.Skip()
	}
	c := &config{
		host: "impl.easi.cms.gov",
		file: "",
	}
	err := execute(c)
	assert.NoError(t, err)
}
