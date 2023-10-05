// Package sanitization contains utility for sanitizing raw input into sanitized output
package sanitization

import (
	"sync"

	"github.com/microcosm-cc/bluemonday"
)

var once sync.Once

var htmlSanitizerPolicy *bluemonday.Policy

// SanitizeHTML takes a string representation of HTML and sanitizes it
func SanitizeHTML[stringType ~string](input stringType) stringType {
	policy := getHTMLSanitizerPolicy()

	output := policy.Sanitize(string(input))

	return stringType(output)
}

// getHTMLSanitizerPolicy returns the sanitization policy for HTML
func getHTMLSanitizerPolicy() *bluemonday.Policy {

	// once ensures that a policy is instantiated once. Otherwise, it is just retrieved.
	once.Do(func() {
		policy := createHTMLPolicy()
		htmlSanitizerPolicy = policy
	})

	return htmlSanitizerPolicy
}

// createHTMLPolicy instantiates the standard HTML sanitization policy for the EASI application
func createHTMLPolicy() *bluemonday.Policy {

	policy := bluemonday.NewPolicy()
	// NOTE make sure to update the allowed policy on the frontend when it is updated here as well
	// TODO: SW update to match frontend policies. Should we allow
	policy.AllowElements("p", "br", "strong", "em", "ol", "ul", "li", "a")

	// Rules for links
	// if not included, this will be added to all links rel="nofollow noreferrer noopener"
	policy.AllowStandardURLs()
	policy.AllowAttrs("href").OnElements("a")
	policy.AllowRelativeURLs(false)
	policy.AddTargetBlankToFullyQualifiedLinks(true)
	policy.RequireNoReferrerOnLinks(true)

	// rules for mentions
	// <span data-type="mention" class="mention" data-id="SKZO" data-label="Alexander Stark">@Alexander Stark</span>
	policy.AllowElements("span")
	policy.AllowAttrs("data-type", "class", "data-id", "data-label").OnElements("span")
	// policy.AllowElementsMatching() // TODO: can we use this to make sure that the span only is allowed with required elements?
	return policy

}
