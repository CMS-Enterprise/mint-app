package models

// PossibleOperationalSolutionContact represents a contact for a possible operational solution
type PossibleOperationalSolutionContact struct {
	baseStruct
	PossibleOperationalSolutionID int `db:"possible_operational_solution_id" json:"possibleOperationalSolutionID"`

	Name  string `db:"name" json:"name"`
	Email string `db:"email" json:"email"`
	Role  string `db:"role" json:"role"`
}
