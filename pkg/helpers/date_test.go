package helpers

import (
	"sync"
	"testing"
	"time"
)

func TestLoadEastern(t *testing.T) {
	const callers = 32
	locations := make([]*time.Location, callers)
	start := make(chan struct{})
	var wg sync.WaitGroup

	for i := range locations {
		wg.Add(1)
		go func() {
			defer wg.Done()
			<-start
			locations[i] = LoadEastern()
		}()
	}
	close(start)
	wg.Wait()

	loc := locations[0]
	if loc == nil {
		t.Fatal("LoadEastern returned nil")
	}
	if got := loc.String(); got != easternTZ {
		t.Fatalf("location name = %q, want %q", got, easternTZ)
	}
	for i, other := range locations {
		if other != loc {
			t.Errorf("caller %d received a different location", i)
		}
	}

	for _, tc := range []struct {
		name       string
		instant    time.Time
		wantZone   string
		wantOffset int
	}{
		{"winter", time.Date(2026, time.January, 15, 12, 0, 0, 0, time.UTC), "EST", -5 * 60 * 60},
		{"summer", time.Date(2026, time.July, 15, 12, 0, 0, 0, time.UTC), "EDT", -4 * 60 * 60},
	} {
		t.Run(tc.name, func(t *testing.T) {
			zone, offset := tc.instant.In(loc).Zone()
			if zone != tc.wantZone || offset != tc.wantOffset {
				t.Errorf("zone = %s (%d seconds), want %s (%d seconds)", zone, offset, tc.wantZone, tc.wantOffset)
			}
		})
	}
}
