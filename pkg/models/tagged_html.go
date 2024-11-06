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
	"github.com/samber/lo"
	htmlPackage "golang.org/x/net/html"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/sanitization"
)

const mentionTagTemplate = `<span data-type="mention" tag-type="{{.Type}}" class="mention" data-id="{{.EntityRaw}}" ` +
	`{{if .EntityDB}}data-id-db="{{.EntityDB}}" {{end}}` +
	`data-label="{{.DataLabel}}">{{.InnerHTML}}</span>`

// TaggedContent represents rich text HTML with possible tagged HTML mention
type TaggedContent struct {
	RawContent html
	Mentions   []*HTMLMention // These are the parsed content of the HTML, and a representaton of how the data represented in an individual mention HTML tag
	Tags       []*Tag         // Tag is a representation of a tag record in the database.
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
	EntityDB    interface{}   // This is for marshaling to the template
	Entity      *TaggedEntity // this is used to store a reference to the tagged entity
}

// TaggedHTML Is the input type for HTML that could contain tags
type TaggedHTML TaggedContent

// UniqueMentions returns a slices that are unique
func (th TaggedHTML) UniqueMentions() []*HTMLMention {
	uniqueMentions := lo.UniqBy(th.Mentions, func(mention *HTMLMention) string {

		key := fmt.Sprint(mention.Type, mention.EntityRaw) //The entity raw, and tag type will be unique.
		return key
	})

	return uniqueMentions
}

// ToTaggedContent casts the input to TaggedContent
func (th TaggedHTML) ToTaggedContent() TaggedContent {
	return TaggedContent(th)
}

// UnmarshalGQLContext unmarshals the data from graphql to the TaggedHTML type
func (th *TaggedHTML) UnmarshalGQLContext(_ context.Context, v interface{}) error {
	rawHTML, ok := v.(string)
	if !ok {
		return errors.New("invalid TaggedHTML")
	}

	// Sanitize the HTML string
	sanitizedHTMLString := sanitization.SanitizeHTML(rawHTML)
	tc, err := NewTaggedContentFromString(sanitizedHTMLString)
	if err != nil {
		return err
	}
	*th = TaggedHTML(tc)
	return nil

}

// MarshalGQLContext marshals the TaggedHTML type to JSON to return to graphQL
func (th TaggedHTML) MarshalGQLContext(ctx context.Context, w io.Writer) error {
	logger := appcontext.ZLogger(ctx)

	// Marshal the TaggedHTML value to JSON so that it's properly escaped (wrapped in quotation marks)
	jsonValue, err := json.Marshal(th.RawContent)
	if err != nil {
		logger.Info("invalid TaggedHTML")
		return fmt.Errorf("failed to marshal TaggedHTMLto JSON: %w", err)
	}
	// Write the JSON-encoded TaggedHTML value to the writer
	_, err = w.Write(jsonValue)
	if err != nil {
		return fmt.Errorf("failed to write TaggedHTML to writer: %w", err)
	}

	return nil
}

// NewTaggedContentFromString converts a rawString into TaggedHTMl. It will store the input string as the raw content, and then sanitize and parse the input.
func NewTaggedContentFromString(htmlString string) (TaggedContent, error) {
	sanitized := sanitization.SanitizeHTML(htmlString)
	tc := TaggedContent{
		RawContent: html(sanitized),
	}
	// mentions, err := htmlMentionsFromString(sanitized)
	mentions, err := htmlMentionsFromStringRegex(sanitized)
	if mentions != nil {
		if len(mentions) > 0 { // At least some mentions parsed correctly, so attach them to the Tagged HTML
			tc.Mentions = mentions
		}
	}
	if err != nil {
		return tc, err //If the Mentions fail to parse, still return the main Tagged HTML
	}
	tc.Mentions = mentions

	return tc, nil

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
	// Also, this only parses <span> elements that have data-type="mention" (otherwise
	// it's probably just a regular/non-mention span that we shouldn't try and parse)
	// data-type="mention" comes from TipTap
	regexPattern := `<span[^>]* data-type="mention"[^>]*>.*?<\/span>`

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
func (th *TaggedContent) Scan(src interface{}) error {

	switch src := src.(type) {
	case string:
		rawContent := string(src)
		tagHTML, err := NewTaggedContentFromString(rawContent)
		if err != nil {
			return err
		}
		*th = tagHTML
	case []byte:
		rawContent := string(src)
		tagHTML, err := NewTaggedContentFromString(rawContent)
		if err != nil {
			return err
		}
		*th = tagHTML
	case nil:
		return nil

	}
	return nil
}

// Value implements the driver.Valuer interface. This is called when  TaggedContent is being written to the database
func (th TaggedContent) Value() (driver.Value, error) {
	// Return the RawContent field as a value
	return string(th.RawContent), nil
}

// Scan is used by sql.scan to read the values from the DB
func (th *TaggedHTML) Scan(src interface{}) error {

	switch src := src.(type) {
	case string:
		rawContent := string(src)
		tagHTML, err := NewTaggedContentFromString(rawContent)
		if err != nil {
			return err
		}
		*th = TaggedHTML(tagHTML)
	case []byte:
		rawContent := string(src)
		tagHTML, err := NewTaggedContentFromString(rawContent)
		if err != nil {
			return err
		}
		*th = TaggedHTML(tagHTML)
	case nil:
		return nil

	}
	return nil
}

// Value implements the driver.Valuer interface. This is called when a TaggedHTML is being written to the database
func (th TaggedHTML) Value() (driver.Value, error) {
	// Return the RawContent field as a value
	return string(th.RawContent), nil
}
