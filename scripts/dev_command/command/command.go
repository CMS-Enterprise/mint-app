// Package command holds specifc commands called by the dev_command program
package command

// flagComponent is a struct to specify properties of a flag
type flagComponent struct {
	// the full name specified in  Cobra after --
	Name string
	// the short hand name specified in  Cobra after -
	ShortHand string
	// the text string to describe the effect of the flag, used by the help flag
	Usage string
}
