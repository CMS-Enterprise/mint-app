package models

// MTOTemplateCategoryOption represents a deduplicated top-level template category
// and its deduplicated, alphabetized subcategory names.
type MTOTemplateCategoryOption struct {
	Name          string   `json:"name"`
	SubCategories []string `json:"subCategories"`
}
