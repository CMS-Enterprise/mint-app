package utilitytime

import "time"

func IsTimeNilOrZero(t *time.Time) bool {
	return t == nil || t.IsZero()
}
