package models

// CTATRequestDocument represents a supporting document attached to a CTAT request.
type CTATRequestDocument struct {
	baseStruct
	ctatRequestRelation

	URL *string `json:"url,omitempty" db:"url"`

	FileType string `json:"fileType" db:"file_type"`
	Bucket   string `json:"bucket" db:"bucket"`
	FileKey  string `json:"fileKey" db:"file_key"`

	VirusScanned bool   `json:"virusScanned" db:"virus_scanned"`
	VirusClean   bool   `json:"virusClean" db:"virus_clean"`
	Restricted   bool   `json:"restricted" db:"restricted"`
	FileName     string `json:"fileName" db:"file_name"`
	FileSize     int    `json:"fileSize" db:"file_size"`
}
