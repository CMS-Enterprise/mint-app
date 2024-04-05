package main

import "github.com/charmbracelet/lipgloss"

// Style Definitions
var (
	oddballGreen     = lipgloss.Color("#7bdcb5")
	_                = oddballGreen
	oddballGreenCyan = lipgloss.Color("#00d084")
	oddballBlueCyan  = lipgloss.Color("#0693e3")
	_                = oddballBlueCyan
	oddballStyle     = lipgloss.NewStyle().Foreground(oddballBlueCyan).Background(oddballGreenCyan)

	lightForegroundGreen = lipgloss.Color("#01BE85")
	darkBackgroundGreen  = lipgloss.Color("#00432F")

	backgroundFillStyle = lipgloss.NewStyle().Background(lightForegroundGreen)
	_                   = backgroundFillStyle

	selectedStyle = lipgloss.NewStyle().Foreground(lightForegroundGreen).Background(darkBackgroundGreen)
	// selectedStyle = oddballStyle
	_ = oddballGreen
	_ = oddballGreenCyan
	_ = oddballBlueCyan
	_ = oddballStyle

	//Borders
	activeTabBorder = lipgloss.Border{
		Top:         "─",
		Bottom:      " ",
		Left:        "│",
		Right:       "│",
		TopLeft:     "╭",
		TopRight:    "╮",
		BottomLeft:  "┘",
		BottomRight: "└",
	}
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
	fullBorder = lipgloss.Border{
		Top:         "─",
		Bottom:      "─",
		Left:        "│",
		Right:       "│",
		TopLeft:     "╭",
		TopRight:    "╮",
		BottomLeft:  "└",
		BottomRight: "┘",
	}

	tabStyle = lipgloss.NewStyle().
			Border(tabBorder, true).
			BorderForeground(oddballBlueCyan).
			Padding(0, 1)
	activeTabStyle       = tabStyle.Copy().Border(activeTabBorder, true)
	fullBorderStyle      = tabStyle.Copy().Border(fullBorder, true)
	tabStyleFilled       = tabStyle.Copy().Background(lightForegroundGreen)
	activeTabStyleFilled = activeTabStyle.Copy().Background(lightForegroundGreen)
	_                    = tabStyleFilled

	tabGapStyle = tabStyle.Copy().
			BorderTop(false).
			BorderLeft(false).
			BorderRight(false)
)
