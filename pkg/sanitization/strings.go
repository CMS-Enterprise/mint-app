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
