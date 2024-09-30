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

// SanitizeStringPointerIfEmpty removes leading/trailing whitespace and all line breaks.
// / it additionally returns null if it is an empty string
func SanitizeStringPointerIfEmpty(input string) *string {

	ret := SanitizeString(input)
	if ret == "" {
		return nil
	}
	return &ret
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
