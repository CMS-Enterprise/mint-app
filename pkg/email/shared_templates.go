package email

import (
	_ "embed"
	htmlTemplate "html/template"
)

//go:embed templates/shared_style.html
var sharedStyleTemplate string

//go:embed templates/shared_header.html
var sharedHeaderTemplate string

//go:embed templates/shared_access_banner.html
var sharedAccessBannerTemplate string

//go:embed templates/shared_footer.html
var sharedFooterTemplate string

//go:embed templates/shared_solution_poc_footer.html
var sharedSolutionPOCFooterTemplate string

//go:embed templates/shared_mto_common_solution_header.html
var sharedMTOCommonSolutionHeaderTemplate string

//go:embed templates/shared_mint_mailbox_header.html
var sharedMintMailboxHeader string

//go:embed templates/shared_mint_mailbox_footer.html
var sharedMintMailboxFooter string

//go:embed templates/shared_non_mint_mailbox_header.html
var sharedNonMintMailboxHeader string

//go:embed templates/shared_non_mint_mailbox_short_header.html
var sharedNonMintMailboxShortHeader string

//go:embed templates/shared_subscribed_footer.html
var sharedSubscribedFooterTemplate string

var predefinedTemplates = map[string]string{
	"shared_style.html":                         sharedStyleTemplate,
	"shared_header.html":                        sharedHeaderTemplate,
	"shared_footer.html":                        sharedFooterTemplate,
	"shared_access_banner.html":                 sharedAccessBannerTemplate,
	"shared_solution_poc_footer.html":           sharedSolutionPOCFooterTemplate,
	"shared_mto_common_solution_header.html":    sharedMTOCommonSolutionHeaderTemplate,
	"shared_mint_mailbox_header.html":           sharedMintMailboxHeader,
	"shared_mint_mailbox_footer.html":           sharedMintMailboxFooter,
	"shared_non_mint_mailbox_header.html":       sharedNonMintMailboxHeader,
	"shared_non_mint_mailbox_short_header.html": sharedNonMintMailboxShortHeader,
	"shared_subscribed_footer.html":             sharedSubscribedFooterTemplate,
}

var embeddedLocalTemplates *htmlTemplate.Template

// EmbeddedTemplates is a collection of all embedded/shared email templates
var EmbeddedTemplates = mustGetEmbeddedTemplates()

func getEmbeddedTemplates() (*htmlTemplate.Template, error) {
	if embeddedLocalTemplates == nil {
		embeddedLocalTemplates = htmlTemplate.New("embedded_local_templates")
		// Parse all the shared/embedded templates first
		for name, content := range predefinedTemplates {
			_, err := embeddedLocalTemplates.New(name).Parse(content) // Add the shared template under its name
			if err != nil {
				return nil, err
			}
		}

	}
	return embeddedLocalTemplates, nil
}
func mustGetEmbeddedTemplates() *htmlTemplate.Template {
	templates, err := getEmbeddedTemplates()
	if err != nil {
		panic(err)
	}
	return templates
}
