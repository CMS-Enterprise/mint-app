package models

import (
	"context"
	"errors"
	"fmt"
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
type TaggedHTMLInput string

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
	*thi = TaggedHTMLInput(sanitizedHTMLString)
	return nil

}

// NewTaggedHTMLFromString converts a rawString into TaggedHTMl
func NewTaggedHTMLFromString(htmlString string) (TaggedHTML, error) {
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

func parseHTMLMentionTag(mendtionNode html.Node) (HTMLMention, error) {
	// htmlMention := HTMLMention{}
	var entityIDStr string
	var dataLabel string
	var entityUUID *uuid.UUID
	var entityIntID *int
	var tagType TagType
	var class string
	attributes := make(map[string]string)
	for _, a := range mendtionNode.Attr {
		attributes[a.Key] = a.Val
	}

	tagType = TagType(attributes["data-type"])
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

	return HTMLMention{
		RawHTML:     mendtionNode,
		Type:        tagType,
		EntityRaw:   entityIDStr, //TODO, maybe we need to keep it generic at this point. Perhaps when writing the tag we can get the reference and perhaps update the tag?
		DataLabel:   dataLabel,
		EntityUUID:  entityUUID,
		EntityIntID: entityIntID,
	}, nil

}

// UnmarshalGQLContext unmarshals the data from graphql to the TaggedHTML type
func (th *TaggedHTML) UnmarshalGQLContext(ctx context.Context, v interface{}) error {

	logger := appcontext.ZLogger(ctx) //TODO: SW do we need the logger?

	rawHTML, ok := v.(string)
	if !ok {
		logger.Info("invalid TaggedHTMLInput")
		return errors.New("invalid TaggedHTMLInput")
	}

	// Sanitize the HTML string
	sanitizedHTMLString := sanitization.SanitizeHTML(rawHTML)
	*th = TaggedHTML{RawContent: hTML(sanitizedHTMLString)}
	return nil

}
