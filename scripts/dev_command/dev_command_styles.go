package main

import "github.com/charmbracelet/lipgloss"

// Style Definitions
var (
	oddballGreen     = lipgloss.Color("#7bdcb5")
	oddballGreenCyan = lipgloss.Color("#00d084")
	oddballBlueCyan  = lipgloss.Color("#0693e3")
	oddballStyle     = lipgloss.NewStyle().Foreground(oddballBlueCyan).Background(oddballGreenCyan)

	lightForegroundGreen = lipgloss.Color("#01BE85")
	darkBackgroundGreen  = lipgloss.Color("#00432F")

	selectedStyle = lipgloss.NewStyle().Foreground(lightForegroundGreen).Background(darkBackgroundGreen)
	// selectedStyle = oddballStyle

	//Borders
	tabBorder = lipgloss.Border{
		Top:         "─",
		Bottom:      "─",
		Left:        "│",
		Right:       "│",
		TopLeft:     "╭",
		TopRight:    "╮",
		BottomLeft:  "┴",
		BottomRight: "┴",
	}
	border = lipgloss.NewStyle().
		BorderStyle(lipgloss.NormalBorder()).
		BorderForeground(lipgloss.Color("63"))

	tab = lipgloss.NewStyle().
		Border(tabBorder, true).
		BorderForeground(oddballBlueCyan).
		Padding(0, 1)
)
