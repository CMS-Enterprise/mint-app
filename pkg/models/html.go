package models

import (
	htmlPackage "html"
	"html/template"

	"github.com/cms-enterprise/mint-app/pkg/sanitization"
)

// html represents html code. It is sanitized when unmarshaled from graphQL or when converted to html to only allow specific tags
type html string

// HTML sanitizes a string and returns hTML
func HTML(htmlString string) html { //nolint:all // it is desirable that hTML is not exported, so we can enforce sanitization
	sanitized := sanitization.SanitizeHTML(htmlString)
	return html(sanitized)
}

// ToTemplate converts and sanitizes the HTML type to a template.HTML struct
func (h *html) ToTemplate() template.HTML {
	if h == nil {
		return template.HTML("")
	}
	sanitizedHTML := sanitization.SanitizeHTML(*h)
	return template.HTML(sanitizedHTML) //nolint //the html is sanitized again on the previous line so we can ignore the warning about
}
func (h *html) InnerHTML() string {
	if h == nil {
		return ""
	}
	return sanitization.InnerHTML(h.String())
}

func (h html) String() string {
	// TODO: Remove this hotfix that was introduced as a result of entities being rendered as escaped HTML in non-rich-text views
	// (Rich Text views handle this escaped data properly, so this hotfix is only needed until we implement rich text views across the board)
	// Note: We only really need to do this here, instead of ALSO doing it in email code because the encoded HTML is handled cleanly by the html/template package
	return htmlPackage.UnescapeString(string(h))
}
