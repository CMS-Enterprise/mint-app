package models

import (
	"fmt"
	"io"
	"time"
)

// Date is a custom type that is used to represent a date in the format YYYY-MM-DD
// It is composed of a time.Time object, and for all intents and purposes is a time.Time object
type Date struct {
	time.Time
}

const dateLayout = "2006-01-02"

// UnmarshalGQL implements the graphql.Unmarshaler interface
func (d *Date) UnmarshalGQL(v interface{}) error {
	dateString, ok := v.(string)
	if !ok {
		return fmt.Errorf("Date must be a string")
	}

	t, err := time.Parse(dateLayout, dateString)
	if err != nil {
		return fmt.Errorf("Date must be in the format %v", dateLayout)
	}

	*d = *NewDate(t)
	return nil
}

// MarshalGQL implements the graphql.Marshaler interface
func (d Date) MarshalGQL(w io.Writer) {
	fmt.Fprintf(w, `"%s"`, d.Format(dateLayout))
}

// NewDate returns a new Date object given a time.Time object
func NewDate(time time.Time) *Date {
	return &Date{Time: time}
}
