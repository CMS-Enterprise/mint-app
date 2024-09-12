package sanitization

import "strings"

// SanitizeString removes leading/trailing whitespace and all line breaks.
func SanitizeString(input string) string {
	// Trim leading and trailing whitespace
	trimmed := strings.TrimSpace(input)
	// Replace all line breaks (\n) with an empty string
	sanitized := strings.ReplaceAll(trimmed, "\n", "")
	return sanitized
}

// YNStringToBool will return true if the value is Y, and false if it is N.
// Anything else returns nil
func YNStringToBool(input string) *bool {
	t := true
	f := false
	if input == "Y" {
		return &t
	}
	if input == "N" {
		return &f
	}
	return nil

}
