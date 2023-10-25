package models

import (
	"context"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"strings"

	"github.com/google/uuid"
	"golang.org/x/net/html"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/sanitization"
)

// TaggedHTML represents rich text HTML with possible tagged HTML mention
type TaggedHTML struct {
	RawContent hTML
	Mentions   []*HTMLMention
	Tags       []*Tag // TODO: Verify, this is the actual tag from the dB
}

// HTMLMention represents Meta data about an entity tagged in text
type HTMLMention struct {
	RawHTML     html.Node
	Type        TagType
	DataLabel   string
	EntityRaw   string
	EntityUUID  *uuid.UUID
	EntityIntID *int
}

// hTML represents html code. It is sanitized when unmarshaled from graphQL or when converted to hTML to only allow specific tags
type hTML string

// TaggedHTMLInput Is the input type for HTML that could contain tags
type TaggedHTMLInput TaggedHTML

// ToTaggedHTML casts the input to TaggedHTML
func (thi TaggedHTMLInput) ToTaggedHTML() TaggedHTML {
	return TaggedHTML(thi)
}

// TODO: can we represent this as the same as the output struct?

// UnmarshalGQLContext unmarshals the data from graphql to the TaggedHTMLInput type
func (thi *TaggedHTMLInput) UnmarshalGQLContext(ctx context.Context, v interface{}) error {
	logger := appcontext.ZLogger(ctx) //TODO: SW do we need the logger?

	rawHTML, ok := v.(string)
	if !ok {
		logger.Info("invalid TaggedHTMLInput")
		return errors.New("invalid TaggedHTMLInput")
	}

	// Sanitize the HTML string
	sanitizedHTMLString := sanitization.SanitizeHTML(rawHTML)
	th, err := NewTaggedHTMLFromString(sanitizedHTMLString)
	if err != nil {
		return err
	}
	*thi = TaggedHTMLInput(th)
	// *thi = TaggedHTMLInput{
	// 	RawContent: hTML(sanitizedHTMLString),
	// }
	return nil

}

// MarshalGQLContext marshals the TaggedHTMLInput type to JSON to return to graphQL
func (thi TaggedHTMLInput) MarshalGQLContext(ctx context.Context, w io.Writer) error {
	logger := appcontext.ZLogger(ctx) //TODO: SW do we need the logger?

	// TODO: SW decide the format this should go back to GQL with
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

// NewTaggedHTMLFromString converts a rawString into TaggedHTMl
func NewTaggedHTMLFromString(htmlString string) (TaggedHTML, error) { // TODO: SW [TaggedHTMLType ~TaggedHTML] Check if we can use a generic here to return input type. (Most likely not)
	sanitized := sanitization.SanitizeHTML(htmlString)
	th := TaggedHTML{
		RawContent: hTML(sanitized),
	}
	mentions, err := htmlMentionsFromString(sanitized)
	if err != nil {
		return th, err //TODO: SW , should we return nil , err or ok to return partial?
	}
	th.Mentions = mentions

	return th, nil

}

func htmlMentionsFromString(htmlString string) ([]*HTMLMention, error) {
	mentions := []*HTMLMention{}
	mentionNodes, err := extractHTMLMentions(htmlString)
	if err != nil {
		return nil, err
	}
	for _, node := range mentionNodes {
		htmlMention, err := parseHTMLMentionTag(*node)
		if err != nil {
			fmt.Println("error parsing %w", err) //TODO: when implementing actually handle this error
		}
		mentions = append(mentions, &htmlMention)
	}
	return mentions, nil

}

func extractHTMLMentions(htmlString string) ([]*html.Node, error) {
	htmlDoc, err := html.Parse(strings.NewReader(htmlString))
	if err != nil {
		return nil, err
	}

	// Find and print all links on the web page
	var links []*html.Node
	var link func(*html.Node)
	link = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == "span" {
			links = append(links, n)
			//TODO: SW determine if it is better to parse attributes here?
		}

		// traverses the HTML from each element
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			link(c)
		}
	}
	link(htmlDoc)

	return links, nil

}

func parseHTMLMentionTag(mentionNode html.Node) (HTMLMention, error) {
	// htmlMention := HTMLMention{}
	var entityIDStr string
	var dataLabel string
	// var entityUUID *uuid.UUID
	// var entityIntID *int
	var tagType TagType
	var class string
	attributes := make(map[string]string)
	for _, a := range mentionNode.Attr {
		attributes[a.Key] = a.Val
	}
	// TODO add a new attribute

	tagType = TagType(attributes["tag-type"])
	err := tagType.Validate()
	if err != nil {
		return HTMLMention{}, err //TODO: SW should we return a pointer instead?
	}

	dataLabel = attributes["data-label"]
	entityIDStr = attributes["data-id"]
	class = attributes["class"]
	if class != "mention" {
		return HTMLMention{}, fmt.Errorf("this is not a valid mention provided class is : %s", class)
	}
	dataIDDB := attributes["data-id-db"] // TODO: SW this should not be set yet actually
	fmt.Print(dataIDDB)
	// switch tagType {
	// case TagTypeUserAccount:
	// 	entityUUID = dataIDDB

	// }

	//TODO, need to update with a data-id-db tag, and update the raw string
	// TODO somewhere data-id-db needs to be updated as well

	return HTMLMention{
		RawHTML:   mentionNode,
		Type:      tagType,
		EntityRaw: entityIDStr, //TODO, maybe we need to keep it generic at this point. Perhaps when writing the tag we can get the reference and perhaps update the tag?
		DataLabel: dataLabel,
		// EntityUUID:  entityUUID,
		// EntityIntID: entityIntID,
	}, nil

}

// ToTag converts a TagString to a tag
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
