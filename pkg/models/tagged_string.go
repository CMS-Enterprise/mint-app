package models

import (
	"context"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"regexp"
	"strconv"
	"strings"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/appcontext"
)

// TaggedString represents a string with an internal tag
type TaggedString struct {
	RawContent string
	Tags       []*Tag
}

// TaggedStringFromRawString turns a raw string into a tag
func TaggedStringFromRawString(rawString string) (TaggedString, error) {
	ts := TaggedString{
		RawContent: rawString,
	}
	tags, err := tagsFromRawString(rawString)
	if err != nil {
		return ts, err //TODO: SW , should we return nil , err or ok to return partial?
	}
	ts.Tags = tags

	return ts, nil

}

func tagsFromRawString(rawString string) ([]*Tag, error) {
	tagSlice := []*Tag{}

	tagRegex := `<tag[^>]*\/>`
	re, err := regexp.Compile(tagRegex)
	if err != nil {
		return nil, errors.New("error parsing regex")
	}
	tagStrings := re.FindAllString(rawString, -1)
	for _, tagString := range tagStrings {
		tag, err := newTagFromString(tagString)
		if err != nil {
			return []*Tag{}, err //TODO: SW should we return anything if there was an error?
		}
		tagSlice = append(tagSlice, &tag) //TODO: SW perhaps this should be by value and not by pointer?

	}

	return tagSlice, nil

}

// Tag represents Meta data about an entity tagged in text
type Tag struct {
	RawString   string
	Type        TagType
	EntityUUID  *uuid.UUID
	EntityIntID *int
}

// TagType represents the posible types of tags you can have in a TaggedString
type TagType string

// Validate checks that a valid value of TagType is returned
func (tt TagType) Validate() error {
	switch tt {
	case TagTypeUser:
		return nil
	case TagTypeSolution:
		return nil
	}
	return fmt.Errorf("%s is not a valid value for TagType", tt)
}

// These constants represent the different values of TagType
const (
	TagTypeUser     TagType = "USER"
	TagTypeSolution TagType = "SOLUTION"
)

func newTagFromString(tagString string) (Tag, error) { //TODO: SW should we handle an error here as well?

	tagRegex := `<tag(?P<attributes>(?:\s+\w+="[^"]*")+)\s*\/>`
	attributeRegex := `\s*(?P<name>\w+)="(?P<value>[^"]*)"`
	re := regexp.MustCompile(tagRegex)
	attributeRe := regexp.MustCompile(attributeRegex)
	entityUUID := uuid.Nil
	var entityIntID *int

	matches := re.FindStringSubmatch(tagString)
	if len(matches) < 2 {
		// Invalid tag string format
		return Tag{}, errors.New(" tag is missing necessary components")
	}

	// TODO: SW review this thoroughly

	rawString := matches[0]
	fmt.Print(rawString)
	attributesString := matches[1]
	attributeMatches := attributeRe.FindAllStringSubmatch(attributesString, -1)

	attributes := make(map[string]string)
	for _, match := range attributeMatches {
		name := match[1]
		value := match[2]
		attributes[name] = value
	}

	tagTypeStr := attributes["type"]
	entityIDStr := attributes["entityID"]
	tagType := TagType(tagTypeStr)
	err := tagType.Validate()
	if err != nil {
		return Tag{}, err //TODO: SW should we return a pointer instead?
	}

	switch tagType { //TODO: Solution is an int id, user is a UUID
	case TagTypeUser:
		entityUUID, err = uuid.Parse(strings.TrimSpace(entityIDStr))
		if err != nil {
			return Tag{}, fmt.Errorf("error parsing UUID in tag. error : %w", err) //TODO: SW should we return a pointer instead?
		}
	case TagTypeSolution:
		number, err := strconv.Atoi(entityIDStr)
		if err != nil {
			return Tag{}, fmt.Errorf("error parsing into in tag. error : %w", err) //TODO: SW should we return a pointer instead?
		}
		entityIntID = &number
	}

	return Tag{
		RawString:   tagString,
		Type:        tagType,
		EntityUUID:  &entityUUID,
		EntityIntID: entityIntID,
	}, nil

}

// UnmarshalGQLContext converts raw input from GQL to a TaggedString Type
func (ts *TaggedString) UnmarshalGQLContext(ctx context.Context, v interface{}) error {
	logger := appcontext.ZLogger(ctx)

	rawString, ok := v.(string)
	if !ok {
		logger.Info("invalid TaggedString")
		return errors.New("invalid TaggedString")

	}

	taggedString, err := TaggedStringFromRawString(rawString)
	if err != nil {
		return err
	}
	*ts = taggedString

	return nil
}

// MarshalGQLContext marshals the TaggedString type to JSON to return to graphQL
func (ts TaggedString) MarshalGQLContext(ctx context.Context, w io.Writer) error {
	logger := appcontext.ZLogger(ctx) //TODO: SW do we need the logger?

	// TODO: SW decide the format this should go back to GQL with
	// Marshal the TaggedString value to JSON so that it's properly escaped (wrapped in quotation marks)
	jsonValue, err := json.Marshal(ts)
	if err != nil {
		logger.Info("invalid TaggedString")
		return fmt.Errorf("failed to marshal TaggedStringto JSON: %w", err)
	}
	// Write the JSON-encoded TaggedString value to the writer
	_, err = w.Write(jsonValue)
	if err != nil {
		return fmt.Errorf("failed to write TaggedString to writer: %w", err)
	}

	return nil
}

// Scan is used by sql.scan to read the values from the DB
func (ts *TaggedString) Scan(src interface{}) error {

	switch src := src.(type) {
	case string:
		rawContent := string(src)
		tagString, err := TaggedStringFromRawString(rawContent)
		if err != nil {
			return err
		}
		*ts = tagString
	case []byte:
		rawContent := string(src)
		tagString, err := TaggedStringFromRawString(rawContent)
		if err != nil {
			return err
		}
		*ts = tagString
	case nil:
		return nil

	}
	return nil
}

// Value implements the driver.Valuer interface. This is called when a TaggedString is being written to the database
func (ts TaggedString) Value() (driver.Value, error) {
	// Return the RawContent field as a value
	return ts.RawContent, nil
}
