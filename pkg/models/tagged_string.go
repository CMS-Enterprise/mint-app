package models

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"regexp"

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
		tag := newTagFromString(tagString)
		tagSlice = append(tagSlice, &tag) //TODO: SW perhaps this should be by value and not by pointer?

	}

	return tagSlice, nil

}

// Tag represents Meta data about an entity tagged in text
type Tag struct {
	RawString string
}

func newTagFromString(tagString string) Tag { //TODO: SW should we handle an error here as well?

	return Tag{
		RawString: tagString,
	}

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
func (ts *TaggedString) MarshalGQLContext(ctx context.Context, w io.Writer) error {
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
