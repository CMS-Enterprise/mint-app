package models

// DocumentType is an enum that represents the type of document
type DocumentType string

// These constants represent the different values of DocumentType
const (
	DocumentTypeConceptPaper   DocumentType = "CONCEPT_PAPER"
	DocumentTypePolicyPaper    DocumentType = "POLICY_PAPER"
	DocumentTypeICIPDraft      DocumentType = "ICIP_DRAFT"
	DocumentTypeMarketResearch DocumentType = "MARKET_RESEARCH"
	DocumentTypeOther          DocumentType = "OTHER"
)
