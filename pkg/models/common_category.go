package models

// CommonCategory represents a deduplicated top-level template category
// and its deduplicated, alphabetized subcategory names.
type CommonCategory struct {
	Name          string   `json:"name"`
	SubCategories []string `json:"subCategories"`
}
