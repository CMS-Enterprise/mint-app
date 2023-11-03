package models

import (
	"bytes"
	"context"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"io"
	"regexp"

	"github.com/google/uuid"
	htmlPackage "golang.org/x/net/html"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/sanitization"
)

const mentionTagTemplate = `<span data-type="mention" tag-type="{{.Type}}" class="mention" data-id="{{.EntityRaw}}" ` +
	`{{if .EntityDB}}data-id-db="{{.EntityDB}}" {{end}}` +
	`data-label="{{.DataLabel}}">{{.InnerHTML}}</span>`

// TaggedHTML represents rich text HTML with possible tagged HTML mention
type TaggedHTML struct {
	RawContent html
	Mentions   []*HTMLMention
	Tags       []*Tag
}

// HTMLMention represents Meta data about an entity tagged in text
type HTMLMention struct {
	RawHTMLNode htmlPackage.Node
	RawHTML     html
	Type        TagType
	DataLabel   string
	EntityRaw   string
	InnerHTML   string
	EntityUUID  *uuid.UUID
	EntityIntID *int
	EntityDB    interface{} // This is for marshaliing to the template
}

// TaggedHTMLInput Is the input type for HTML that could contain tags
type TaggedHTMLInput TaggedHTML

// ToTaggedHTML casts the input to TaggedHTML
func (thi TaggedHTMLInput) ToTaggedHTML() TaggedHTML {
	return TaggedHTML(thi)
}

// TODO: can we represent this as the same as the output struct?

// UnmarshalGQLContext unmarshals the data from graphql to the TaggedHTMLInput type
func (thi *TaggedHTMLInput) UnmarshalGQLContext(ctx context.Context, v interface{}) error {
	rawHTML, ok := v.(string)
	if !ok {
		return errors.New("invalid TaggedHTMLInput")
	}

	// Sanitize the HTML string
	sanitizedHTMLString := sanitization.SanitizeHTML(rawHTML)
	th, err := NewTaggedHTMLFromString(sanitizedHTMLString)
	if err != nil {
		return err
	}
	*thi = TaggedHTMLInput(th)
	return nil

}

// MarshalGQLContext marshals the TaggedHTMLInput type to JSON to return to graphQL
func (thi TaggedHTMLInput) MarshalGQLContext(ctx context.Context, w io.Writer) error {
	logger := appcontext.ZLogger(ctx)

	// Marshal the TaggedHTMLInput value to JSON so that it's properly escaped (wrapped in quotation marks)
	jsonValue, err := json.Marshal(thi.RawContent)
	if err != nil {
		logger.Info("invalid TaggedHTMLInput")
		return fmt.Errorf("failed to marshal TaggedHTMLInputto JSON: %w", err)
	}
	// Write the JSON-encoded TaggedHTMLInput value to the writer
	_, err = w.Write(jsonValue)
	if err != nil {
		return fmt.Errorf("failed to write TaggedHTMLInput to writer: %w", err)
	}

	return nil
}

// NewTaggedHTMLFromString converts a rawString into TaggedHTMl. It will store the input string as the raw content, and then sanitize and parse the input.
func NewTaggedHTMLFromString(htmlString string) (TaggedHTML, error) {
	sanitized := sanitization.SanitizeHTML(htmlString)
	th := TaggedHTML{
		RawContent: html(sanitized),
	}
	// mentions, err := htmlMentionsFromString(sanitized)
	mentions, err := htmlMentionsFromStringRegex(sanitized)
	if mentions != nil { //TODO: SW, you might not need to do a nil or len check, you might be able to just set it
		if len(mentions) > 0 { // At least some mentions parsed correctly, so attach them to the Tagged HTML
			th.Mentions = mentions
		}
	}
	if err != nil {
		return th, err //If the Mentions fail to parse, still return the main Tagged HTML
	}
	th.Mentions = mentions

	return th, nil

}
func htmlMentionsFromStringRegex(htmlString string) ([]*HTMLMention, error) {
	mentions := []*HTMLMention{}
	mentionStrings, err := extractHTMLSpansRegex(htmlString)
	if err != nil {
		return nil, err
	}
	errs := []error{}
	for _, mentionString := range mentionStrings {
		htmlMention, err := parseHTMLMentionTagRegEx(mentionString)
		if err != nil {
			errs = append(errs, fmt.Errorf("error parsing html mention %s, %w", mentionString, err))

		}
		mentions = append(mentions, &htmlMention)
	}
	if len(errs) > 1 {
		return mentions, fmt.Errorf("issues encountered parsing html Mentions . %v", errs) // We aren't wrapping these errors because this is an array
	}
	return mentions, nil

}

func extractHTMLSpansRegex(htmlString string) ([]string, error) {

	// Define the regex pattern to match the span elements
	regexPattern := `<span[^>]*>.*?<\/span>`

	// Compile the regex pattern
	regex, err := regexp.Compile(regexPattern)
	if err != nil {

		return nil, fmt.Errorf("error compiling regex pattern: %w", err)
	}
	// Find all matches of the pattern in the html string
	matches := regex.FindAllString(htmlString, -1)
	return matches, nil
}

func parseHTMLMentionTagRegEx(mentionstring string) (HTMLMention, error) {
	var entityIDStr string
	var dataLabel string
	var tagType TagType
	var class string

	attributes := extractAttributes(mentionstring)
	innerHTML := extractInnerHTML(mentionstring)

	tagType = TagType(attributes["tag-type"])
	err := tagType.Validate()
	if err != nil {
		return HTMLMention{}, err
	}

	dataLabel = attributes["data-label"]
	entityIDStr = attributes["data-id"]
	class = attributes["class"]
	if class != "mention" {
		return HTMLMention{}, fmt.Errorf("this is not a valid mention provided class is : %s", class)
	}
	dataIDDB := attributes["data-id-db"]
	fmt.Print(dataIDDB)

	return HTMLMention{
		RawHTML:   HTML(mentionstring),
		InnerHTML: innerHTML,
		Type:      tagType,
		EntityRaw: entityIDStr, // Store the raw value to set conditionally later
		DataLabel: dataLabel,
		EntityDB:  dataIDDB,
	}, nil

}

// Function to extract attributes from a span element using regex
func extractAttributes(match string) map[string]string {
	// Define the regex pattern to match attribute name and value
	attributeRegex := regexp.MustCompile(`(\S+)="([^"]+)"`)

	// Find all matches of the pattern in the input string
	attributeMatches := attributeRegex.FindAllStringSubmatch(match, -1)

	// Create a map to store the attribute key-value pairs
	attributes := make(map[string]string)

	// Iterate over the matches and extract the attribute name and value
	for _, attributeMatch := range attributeMatches {
		attributeName := attributeMatch[1]
		attributeValue := attributeMatch[2]

		attributes[attributeName] = attributeValue
	}

	return attributes
}

// Function to extract inner html from a span element using regex
func extractInnerHTML(match string) string {
	// Define the regex pattern to match the inner html
	innerHTMLRegex := regexp.MustCompile(`>([^<]*)<`)

	// Find the match of the pattern in the input string
	innerHTMLMatch := innerHTMLRegex.FindStringSubmatch(match)

	// Return the inner html
	if len(innerHTMLMatch) > 1 {
		return innerHTMLMatch[1]
	}

	return ""
}

// ToTag converts an HTMLMention to a tag
func (hm HTMLMention) ToTag(taggedField string, taggedTable string, taggedContentID uuid.UUID) Tag {
	tag := Tag{
		TagType:            hm.Type,
		TaggedField:        taggedField,
		TaggedContentTable: taggedTable,
		TaggedContentID:    taggedContentID,
		EntityRaw:          hm.EntityRaw,
		EntityUUID:         hm.EntityUUID,
		EntityIntID:        hm.EntityIntID,
	}
	return tag
}

// ToHTML converts an HTMLMention to an HTMLString
func (hm HTMLMention) ToHTML() (html, error) { //nolint:all // it is desirable that hTML is not exported, so we can enforce sanitization
	// Create a new template and parse the template string
	t, err := template.New("webpage").Parse(mentionTagTemplate)
	if err != nil {
		return "", err
	}
	var buffer bytes.Buffer
	err = t.Execute(&buffer, &hm)
	if err != nil {
		return "", err
	}

	mentionString := buffer.String()
	return HTML(mentionString), nil
}

// TagArrayFromHTMLMentions converts an array of HTMLMention to an array of Tags
func TagArrayFromHTMLMentions(taggedField string, taggedTable string, taggedContentID uuid.UUID, mentions []*HTMLMention) []*Tag {
	tags := []*Tag{}
	for _, mention := range mentions {
		tag := mention.ToTag(taggedField, taggedTable, taggedContentID)
		tags = append(tags, &tag)

	}
	return tags

}

// Scan is used by sql.scan to read the values from the DB
func (th *TaggedHTML) Scan(src interface{}) error {

	switch src := src.(type) {
	case string:
		rawContent := string(src)
		tagHTML, err := NewTaggedHTMLFromString(rawContent)
		if err != nil {
			return err
		}
		*th = tagHTML
	case []byte:
		rawContent := string(src)
		tagHTML, err := NewTaggedHTMLFromString(rawContent)
		if err != nil {
			return err
		}
		*th = tagHTML
	case nil:
		return nil

	}
	return nil
}

// Value implements the driver.Valuer interface. This is called when a TaggedString is being written to the database
func (th TaggedHTML) Value() (driver.Value, error) {
	// Return the RawContent field as a value
	return string(th.RawContent), nil
}

// Scan is used by sql.scan to read the values from the DB
func (thi *TaggedHTMLInput) Scan(src interface{}) error {

	switch src := src.(type) {
	case string:
		rawContent := string(src)
		tagHTML, err := NewTaggedHTMLFromString(rawContent)
		if err != nil {
			return err
		}
		*thi = TaggedHTMLInput(tagHTML)
	case []byte:
		rawContent := string(src)
		tagHTML, err := NewTaggedHTMLFromString(rawContent)
		if err != nil {
			return err
		}
		*thi = TaggedHTMLInput(tagHTML)
	case nil:
		return nil

	}
	return nil
}

// Value implements the driver.Valuer interface. This is called when a TaggedString is being written to the database
func (thi TaggedHTMLInput) Value() (driver.Value, error) {
	// Return the RawContent field as a value
	return string(thi.RawContent), nil
}
