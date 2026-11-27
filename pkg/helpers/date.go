package helpers

import (
	"fmt"
	"sync"
	"time"
)

const easternTZ = "America/New_York"

var (
	easternLoc     *time.Location
	easternLocOnce sync.Once
)

func LoadEastern() *time.Location {
	easternLocOnce.Do(func() {
		loc, err := time.LoadLocation(easternTZ)
		if err != nil {
			panic(fmt.Errorf("failed to load eastern tz location: %w", err))
		}

		easternLoc = loc
	})

	return easternLoc
}
