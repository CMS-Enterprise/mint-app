package main

import (
	"fmt"
	"os"
	"strings"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"golang.org/x/term"
)

type cmdFinishedMsg struct{ err error }

type commandOption interface {
	Run() tea.Msg
	Name() string
	String() string
	LastCMDMessage() string
}
type genericCommandOption struct {
	CommandRun  func()
	CommandName string
}

func (geo genericCommandOption) Run() tea.Msg {
	geo.CommandRun()
	return cmdFinishedMsg{}
}
func (geo genericCommandOption) Name() string {
	return geo.CommandName
}
func (geo genericCommandOption) String() string {
	return geo.Name()
}
func (geo genericCommandOption) LastCMDMessage() string {
	return "Ran " + geo.Name()
}

type commandTab struct {
	Header string
}

var commonCommandTab = commandTab{
	Header: "Common Commands",
}
var myCommandsTab = commandTab{
	Header: "My Commands",
}

var tuiTabs = []*commandTab{
	&commonCommandTab,
	&myCommandsTab,
}

type seedCommandTuiModel struct {
	options        []commandOption
	cursor         int                   // which command option our cursor is pointing at
	selected       map[int]commandOption // which command options are selected
	tabs           []*commandTab
	activeTabIndex int
	activeTab      *commandTab
	err            error
	lastCmd        string
}

func newSeedCommandTuiModel() seedCommandTuiModel {

	model := seedCommandTuiModel{
		activeTabIndex: 0,
		tabs:           tuiTabs,
		options: []commandOption{
			genericCommandOption{
				CommandName: "Clean DB",
				CommandRun:  func() { cleanCmd.Run(cleanCmd, []string{}) },
			},
			genericCommandOption{
				CommandName: "Seed DB",
				CommandRun:  func() { seedCmd.Run(seedCmd, []string{}) },
			},
			genericCommandOption{
				CommandName: "Analyze Audits",
				CommandRun:  func() { analyzeAuditCommand.Run(analyzeAuditCommand, []string{}) },
			},
			genericCommandOption{
				CommandName: "Translate Audits",
				CommandRun:  func() { translateAuditsCommand.Run(translateAuditsCommand, []string{}) },
			},
			genericCommandOption{
				CommandName: "Queue Audits",
				CommandRun:  func() { queueAllTranslatedAuditChangesCommand.Run(queueAllTranslatedAuditChangesCommand, []string{}) },
			},
			genericCommandOption{
				CommandName: "Translate  Next Audit",
				CommandRun: func() {
					translateNextQueuedTranslatedAuditChangesCommand.Run(translateNextQueuedTranslatedAuditChangesCommand, []string{})
				},
			},
			genericCommandOption{
				CommandName: "Translate Audit Queue",
				CommandRun: func() {
					translateAllQueuedTranslatedAuditChangesCommand.Run(translateAllQueuedTranslatedAuditChangesCommand, []string{})
				},
			},
			genericCommandOption{
				CommandName: "Translate and Queue available Audits",
				CommandRun: func() {
					queueAndProcessAllTranslatedAuditChangesCommand.Run(queueAndProcessAllTranslatedAuditChangesCommand, []string{})
				},
			},
			genericCommandOption{
				CommandName: "Export Translation Mappings",
				CommandRun:  func() { translationExportCmd.Run(translationExportCmd, []string{}) },
			},
		},
		// A map which indicates which choices are selected. We're using
		// the  map like a mathematical set. The keys refer to the indexes
		// of the `choices` slice, above.
		selected: make(map[int]commandOption),
	}
	model.SetActiveTab(0)
	return model
}

func (tm seedCommandTuiModel) Init() tea.Cmd {
	return nil
}

func (tm seedCommandTuiModel) View() string {
	physicalWidth, _, _ := term.GetSize(int(os.Stdout.Fd()))
	doc := strings.Builder{}

	width := physicalWidth - 4
	doc.WriteString(tm.RenderTabs(width))
	// doc.WriteString(backgroundFillStyle.Render(tm.RenderTabs(width)))
	doc.WriteString("\n\n")

	doc.WriteString(tm.RenderNestedView())
	// doc.WriteString(backgroundFillStyle.Render(tm.RenderNestedView()))

	// The footer
	doc.WriteString("\nPress q to quit.\n")

	filled := doc.String()
	// filled := backgroundFillStyle.Render(doc.String())

	// Send the UI for rendering
	return fullBorderStyle.Render(filled) + "\n"
}

func (tm seedCommandTuiModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {

	model, cmd := tm.UpdateParentWindow(msg)
	if cmd != nil {
		return model, cmd
	}

	model, childCommand := tm.UpdateActiveTab(msg)
	if childCommand != nil {
		return model, childCommand
	}
	return tm, nil

}
func (tm *seedCommandTuiModel) UpdateParentWindow(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {

	// Is it a key press?
	case tea.KeyMsg:

		// Cool, what was the actual key pressed?
		switch msg.String() {

		// These keys should exit the program.
		case "ctrl+c", "q":
			return tm, tea.Quit

		// The "left" and "u" keys move the activeTab left
		case "left", "u":
			if tm.activeTabIndex > 0 {
				tm.activeTabIndex--
				tm.SetActiveTab(tm.activeTabIndex)

			}

		// The "right" and "i" keys move the activeTab right
		case "right", "i":
			if tm.activeTabIndex < len(tm.tabs)-1 {
				tm.activeTabIndex++
				tm.SetActiveTab(tm.activeTabIndex)
			}

		}
	case cmdFinishedMsg:
		// Clear the screen when the message is received
		if msg.err != nil {
			tm.err = msg.err
			return tm, tea.Quit
		}
		return tm, tea.ClearScreen
	}

	return tm, nil

}

// UpdateCommonCommandTab handles updates when the selected tab is the CommonCommandsTab
func (tm *seedCommandTuiModel) UpdateCommonCommandTab(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {

	// Is it a key press?
	case tea.KeyMsg:
		// what was the actual key pressed?
		switch msg.String() {
		// The "up" and "k" keys move the cursor up
		case "up", "k":
			if tm.cursor > 0 {
				tm.cursor--
			}

		// The "down" and "j" keys move the cursor down
		case "down", "j":
			if tm.cursor < len(tm.options)-1 {
				tm.cursor++
			}

		// The spacebar (a literal space) toggle
		// the selected state for the item that the cursor is pointing at.
		case " ":
			_, ok := tm.selected[tm.cursor]
			if ok {
				delete(tm.selected, tm.cursor)
			} else {
				tm.selected[tm.cursor] = tm.options[tm.cursor]
			}
		// The "enter" key
		case "enter":
			for _, command := range tm.selected {
				tea.SetWindowTitle(command.Name())
				if tm.lastCmd != "" {
					tm.lastCmd = tm.lastCmd + "\n"
				}
				tm.lastCmd += command.LastCMDMessage()
				command.Run()
				// return tm, func() tea.Msg { return example.Run() }

			}
			return tm, func() tea.Msg {
				return cmdFinishedMsg{}
			}
		}
	}
	return tm, nil

}
func (tm *seedCommandTuiModel) UpdateActiveTab(msg tea.Msg) (tea.Model, tea.Cmd) {

	if tm.activeTab == &commonCommandTab {
		return tm.UpdateCommonCommandTab(msg)
	}
	return tm, nil

}

func (tm *seedCommandTuiModel) SetActiveTab(index int) {
	tm.activeTab = tm.tabs[index]
}

func (tm *seedCommandTuiModel) RenderTabs(width int) string {
	tabString := []string{}
	for index, tab := range tm.tabs {
		isActive := index == tm.activeTabIndex
		style := tabStyle

		if isActive {
			style = activeTabStyleFilled
		}
		tabString = append(tabString, style.Render(tab.Header))

	}

	row := lipgloss.JoinHorizontal(
		lipgloss.Top, tabString...,
	)
	gap := tabGapStyle.Render(strings.Repeat(" ", max(0, width-lipgloss.Width(row)-2)))
	row = lipgloss.JoinHorizontal(lipgloss.Bottom, row, gap)
	// row += "\n\n"

	return row
}

func (tm *seedCommandTuiModel) RenderNestedView() string {

	if tm.activeTab == &commonCommandTab {
		return tm.RenderCommandCommandsView()
	}
	return ""

}

func (tm *seedCommandTuiModel) RenderCommandCommandsView() string {
	doc := strings.Builder{}
	doc.WriteString("Which commands would you like to execute?\n\n")

	// tab.Render(s)
	if tm.lastCmd != "" {
		doc.WriteString(fmt.Sprintf("%s\n\n", tm.lastCmd))
	}
	body := strings.Builder{}
	// Iterate over our options
	for i, option := range tm.options {

		optionText := option.String()

		// Is the cursor pointing at this choice?
		cursor := " " // no cursor
		if tm.cursor == i {
			cursor = ">" // cursor!
			cursor = selectedStyle.Render(cursor)
		}

		// Is this choice selected?
		checked := " " // not selected
		if _, ok := tm.selected[i]; ok {
			checked = "✔" // selected!
			checked = selectedStyle.Render(checked)
			optionText = selectedStyle.Render(optionText)
		}

		// Render the row
		body.WriteString(fmt.Sprintf("%s [%s] %s\n", cursor, checked, optionText))
	}
	doc.WriteString(fullBorderStyle.Render(body.String()))
	return doc.String()
}

// RunSeedCommandTuiModel runs the interactive tui version of the command
func RunSeedCommandTuiModel() {

	if _, err := tea.NewProgram(newSeedCommandTuiModel()).Run(); err != nil {

		fmt.Printf("There was an error: %v\n", err)
		os.Exit(1)
	}

}
