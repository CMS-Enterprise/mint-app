package models

import (
	"fmt"
	"strings"

	"github.com/google/uuid"
	"golang.org/x/net/html"

	"github.com/cmsgov/mint-app/pkg/sanitization"
)

// TaggedHTML represents rich text HTML with possible tagged HTML mention
type TaggedHTML struct {
	RawContent string
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

// NewTaggedHTMLFromString converts a rawString into TaggedHTMl
func NewTaggedHTMLFromString(htmlString string) (TaggedHTML, error) {
	sanitized := sanitization.SanitizeHTML(htmlString)
	th := TaggedHTML{
		RawContent: sanitized,
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
			fmt.Println("error parsing %w", node) //TODO: when implementing actually handle this error
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
	for _, a := range mendtionNode.Attr {
		switch a.Key {
		case "data-type":

			tagType = TagType(a.Val)
			err := tagType.Validate()
			if err != nil {
				return HTMLMention{}, err //TODO: SW should we return a pointer instead?
			}

		case "class":
			if a.Val != "mention" {
				return HTMLMention{}, fmt.Errorf("this is not a valid mention provided class is : %s", a.Val)
			}

		case "data-id":
			entityIDStr = a.Val
		case "data-label":
			dataLabel = a.Val

		default:
			continue
		}
	}
	// switch tagType {
	// case TagTypeUserAccount:
	// 	parsedUUID, err := uuid.Parse(strings.TrimSpace(entityIDStr))
	// 	if err != nil {
	// 		return HTMLMention{}, fmt.Errorf("error parsing UUID in tag. error : %w", err)
	// 	}
	// 	entityUUID = &parsedUUID
	// case TagTypePossibleSolution:
	// 	//TODO: how to handle id vs the input that the front end provides?
	// 	number, err := strconv.Atoi(entityIDStr)
	// 	if err != nil {
	// 		return HTMLMention{}, fmt.Errorf("error parsing into in tag. error : %w", err)
	// 	}
	// 	entityIntID = &number
	// }
	return HTMLMention{
		RawHTML:     mendtionNode,
		Type:        tagType,
		EntityRaw:   entityIDStr, //TODO, maybe we need to keep it generic at this point. Perhaps when writing the tag we can get the reference and perhaps update the tage?
		DataLabel:   dataLabel,
		EntityUUID:  entityUUID,
		EntityIntID: entityIntID,
	}, nil

}
