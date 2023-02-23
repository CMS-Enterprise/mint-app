package local

import (
	"context"
	"errors"
	"strings"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/apperrors"
	"github.com/cmsgov/mint-app/pkg/models"
)

// client is a mock client for pkg/oktaapi
type client struct {
	logger *zap.Logger
}

// NewOktaAPIClient returns a mock Okta client
func NewOktaAPIClient(logger *zap.Logger) (*client, error) {
	return &client{
		logger: logger,
	}, nil
}

// getMockUserData returns a slice of *models.UserInfo that represents a response from the CEDAR LDAP server.
// Most of the data here is generated randomly, though some of it was curated specifically for the purpose of making tests pass.
func getMockUserData() []*models.UserInfo {
	return []*models.UserInfo{
		{
			CommonName: "Adeline Aarons",
			Email:      "adeline.aarons@local.fake",
			EuaUserID:  "ABCD",
			FirstName:  "Adeline",
			LastName:   "Aarons",
		},
		{
			CommonName: "Terry Thompson",
			Email:      "terry.thompson@local.fake",
			EuaUserID:  "TEST",
			FirstName:  "Terry",
			LastName:   "Thompson",
		},
		{
			CommonName: "Ally Anderson",
			Email:      "ally.anderson@local.fake",
			EuaUserID:  "A11Y",
			FirstName:  "Ally",
			LastName:   "Anderson",
		},
		{
			CommonName: "Gary Gordon",
			Email:      "gary.gordon@local.fake",
			EuaUserID:  "GRTB",
			FirstName:  "Gary",
			LastName:   "Gordon",
		},
		{
			CommonName: "Charlie Campbell",
			Email:      "charlie.campbell@local.fake",
			EuaUserID:  "CMSU",
			FirstName:  "Charlie",
			LastName:   "Campbell",
		},
		{
			CommonName: "Audrey Abrams",
			Email:      "audrey.abrams@local.fake",
			EuaUserID:  "ADMI",
			FirstName:  "Audrey",
			LastName:   "Abrams",
		},
		{
			CommonName: "Aaron Adams",
			Email:      "aaron.adams@local.fake",
			EuaUserID:  "ADMN",
			FirstName:  "Aaron",
			LastName:   "Adams",
		},
		{
			CommonName: "User One",
			Email:      "user.one@local.fake",
			EuaUserID:  "USR1",
			FirstName:  "User",
			LastName:   "One",
		},
		{
			CommonName: "User Two",
			Email:      "user.two@local.fake",
			EuaUserID:  "USR2",
			FirstName:  "User",
			LastName:   "Two",
		},
		{
			CommonName: "User Three",
			Email:      "user.three@local.fake",
			EuaUserID:  "USR3",
			FirstName:  "User",
			LastName:   "Three",
		},
		{
			CommonName: "User Four",
			Email:      "user.four@local.fake",
			EuaUserID:  "USR4",
			FirstName:  "User",
			LastName:   "Four",
		},
		{
			CommonName: "User Five",
			Email:      "user.five@local.fake",
			EuaUserID:  "USR5",
			FirstName:  "User",
			LastName:   "Five",
		},
		{
			CommonName: "Jerry Seinfeld",
			Email:      "jerry.seinfeld@local.fake",
			EuaUserID:  "SF13",
			FirstName:  "Jerry",
			LastName:   "Seinfeld",
		},
		{
			CommonName: "Cosmo Kramer",
			Email:      "cosmo.kramer@local.fake",
			EuaUserID:  "KR14",
			FirstName:  "Cosmo",
			LastName:   "Kramer",
		},
		{
			CommonName: "Kennedy Kuhic",
			Email:      "kennedy.kuhic@local.fake",
			EuaUserID:  "KVB3",
			FirstName:  "Kennedy",
			LastName:   "Kuhic",
		},
		{
			CommonName: "Theo Crooks",
			Email:      "theo.crooks@local.fake",
			EuaUserID:  "CJRW",
			FirstName:  "Theo",
			LastName:   "Crooks",
		},
		{
			CommonName: "Delphia Green",
			Email:      "delphia.green@local.fake",
			EuaUserID:  "GBRG",
			FirstName:  "Delphia",
			LastName:   "Green",
		},
		{
			CommonName: "Leatha Gorczany",
			Email:      "leatha.gorczany@local.fake",
			EuaUserID:  "GP87",
			FirstName:  "Leatha",
			LastName:   "Gorczany",
		},
		{
			CommonName: "Catherine Rice",
			Email:      "catherine.rice@local.fake",
			EuaUserID:  "RH4V",
			FirstName:  "Catherine",
			LastName:   "Rice",
		},
		{
			CommonName: "Litzy Emard",
			Email:      "litzy.emard@local.fake",
			EuaUserID:  "ER3Z",
			FirstName:  "Litzy",
			LastName:   "Emard",
		},
		{
			CommonName: "Lauriane Stoltenberg",
			Email:      "lauriane.stoltenberg@local.fake",
			EuaUserID:  "S3W0",
			FirstName:  "Lauriane",
			LastName:   "Stoltenberg",
		},
		{
			CommonName: "Zechariah Wyman",
			Email:      "zechariah.wyman@local.fake",
			EuaUserID:  "W1I4",
			FirstName:  "Zechariah",
			LastName:   "Wyman",
		},
		{
			CommonName: "Savanna Hyatt",
			Email:      "savanna.hyatt@local.fake",
			EuaUserID:  "HCNK",
			FirstName:  "Savanna",
			LastName:   "Hyatt",
		},
		{
			CommonName: "Dawn Jaskolski",
			Email:      "dawn.jaskolski@local.fake",
			EuaUserID:  "JG1B",
			FirstName:  "Dawn",
			LastName:   "Jaskolski",
		},
		{
			CommonName: "Anabelle Jerde",
			Email:      "anabelle.jerde@local.fake",
			EuaUserID:  "JTTC",
			FirstName:  "Anabelle",
			LastName:   "Jerde",
		},
		{
			CommonName: "Hilbert Gislason",
			Email:      "hilbert.gislason@local.fake",
			EuaUserID:  "G4A7",
			FirstName:  "Hilbert",
			LastName:   "Gislason",
		},
		{
			CommonName: "Rudolph Pagac",
			Email:      "rudolph.pagac@local.fake",
			EuaUserID:  "POJG",
			FirstName:  "Rudolph",
			LastName:   "Pagac",
		},
		{
			CommonName: "Avis Anderson",
			Email:      "avis.anderson@local.fake",
			EuaUserID:  "ATSI",
			FirstName:  "Avis",
			LastName:   "Anderson",
		},
		{
			CommonName: "Annetta Lockman",
			Email:      "annetta.lockman@local.fake",
			EuaUserID:  "LW40",
			FirstName:  "Annetta",
			LastName:   "Lockman",
		},
		{
			CommonName: "Elva Ruecker",
			Email:      "elva.ruecker@local.fake",
			EuaUserID:  "RP20",
			FirstName:  "Elva",
			LastName:   "Ruecker",
		},
		{
			CommonName: "Waylon Tromp",
			Email:      "waylon.tromp@local.fake",
			EuaUserID:  "TWAW",
			FirstName:  "Waylon",
			LastName:   "Tromp",
		},
		{
			CommonName: "Doyle Heller",
			Email:      "doyle.heller@local.fake",
			EuaUserID:  "HIV3",
			FirstName:  "Doyle",
			LastName:   "Heller",
		},
		{
			CommonName: "Hallie O'Hara",
			Email:      "hallie.ohara@local.fake",
			EuaUserID:  "OQYV",
			FirstName:  "Hallie",
			LastName:   "Hara",
		},
		{
			CommonName: "Laverne Roberts",
			Email:      "laverne.roberts@local.fake",
			EuaUserID:  "R0EI",
			FirstName:  "Laverne",
			LastName:   "Roberts",
		},
		{
			CommonName: "Alexander Stark",
			Email:      "alexander.stark@local.fake",
			EuaUserID:  "SKZO",
			FirstName:  "Alexander",
			LastName:   "Stark",
		},
		{
			CommonName: "Caden Schmeler",
			Email:      "caden.schmeler@local.fake",
			EuaUserID:  "SPJW",
			FirstName:  "Caden",
			LastName:   "Schmeler",
		},
		{
			CommonName: "Nat Krajcik",
			Email:      "nat.krajcik@local.fake",
			EuaUserID:  "K0AM",
			FirstName:  "Nat",
			LastName:   "Krajcik",
		},
		{
			CommonName: "Palma Towne",
			Email:      "palma.towne@local.fake",
			EuaUserID:  "TX4A",
			FirstName:  "Palma",
			LastName:   "Towne",
		},
		{
			CommonName: "Aurelie Morar",
			Email:      "aurelie.morar@local.fake",
			EuaUserID:  "MN3Q",
			FirstName:  "Aurelie",
			LastName:   "Morar",
		},
		{
			CommonName: "Hellen Grimes",
			Email:      "hellen.grimes@local.fake",
			EuaUserID:  "GFRY",
			FirstName:  "Hellen",
			LastName:   "Grimes",
		},
		{
			CommonName: "Kenna Gerhold",
			Email:      "kenna.gerhold@local.fake",
			EuaUserID:  "GZP4",
			FirstName:  "Kenna",
			LastName:   "Gerhold",
		},
		{
			CommonName: "Rolando Weber",
			Email:      "rolando.weber@local.fake",
			EuaUserID:  "WNZ3",
			FirstName:  "Rolando",
			LastName:   "Weber",
		},
		{
			CommonName: "Lance Konopelski",
			Email:      "lance.konopelski@local.fake",
			EuaUserID:  "K0LR",
			FirstName:  "Lance",
			LastName:   "Konopelski",
		},
		{
			CommonName: "Otilia Abbott",
			Email:      "otilia.abbott@local.fake",
			EuaUserID:  "AX0Q",
			FirstName:  "Otilia",
			LastName:   "Abbott",
		},
		{
			CommonName: "Marjory Doyle",
			Email:      "marjory.doyle@local.fake",
			EuaUserID:  "D7R3",
			FirstName:  "Marjory",
			LastName:   "Doyle",
		},
		{
			CommonName: "Yasmine Dare",
			Email:      "yasmine.dare@local.fake",
			EuaUserID:  "D2AC",
			FirstName:  "Yasmine",
			LastName:   "Dare",
		},
		{
			CommonName: "Kayla Zulauf",
			Email:      "kayla.zulauf@local.fake",
			EuaUserID:  "ZOCN",
			FirstName:  "Kayla",
			LastName:   "Zulauf",
		},
		{
			CommonName: "Lucinda Hansen",
			Email:      "lucinda.hansen@local.fake",
			EuaUserID:  "H2KQ",
			FirstName:  "Lucinda",
			LastName:   "Hansen",
		},
		{
			CommonName: "Alyce Haag",
			Email:      "alyce.haag@local.fake",
			EuaUserID:  "HBGM",
			FirstName:  "Alyce",
			LastName:   "Haag",
		},
		{
			CommonName: "Deonte Kassulke",
			Email:      "deonte.kassulke@local.fake",
			EuaUserID:  "KDYZ",
			FirstName:  "Deonte",
			LastName:   "Kassulke",
		},
		{
			CommonName: "Mckayla Fritsch",
			Email:      "mckayla.fritsch@local.fake",
			EuaUserID:  "FAUI",
			FirstName:  "Mckayla",
			LastName:   "Fritsch",
		},
		{
			CommonName: "Brooks Johnson",
			Email:      "brooks.johnson@local.fake",
			EuaUserID:  "J3C8",
			FirstName:  "Brooks",
			LastName:   "Johnson",
		},
		{
			CommonName: "Bernhard Koss",
			Email:      "bernhard.koss@local.fake",
			EuaUserID:  "K9W1",
			FirstName:  "Bernhard",
			LastName:   "Koss",
		},
		{
			CommonName: "Gust Murray",
			Email:      "gust.murray@local.fake",
			EuaUserID:  "MR92",
			FirstName:  "Gust",
			LastName:   "Murray",
		},
		{
			CommonName: "Eldred Hammes",
			Email:      "eldred.hammes@local.fake",
			EuaUserID:  "HY0W",
			FirstName:  "Eldred",
			LastName:   "Hammes",
		},
		{
			CommonName: "Adrianna Gottlieb",
			Email:      "adrianna.gottlieb@local.fake",
			EuaUserID:  "GT98",
			FirstName:  "Adrianna",
			LastName:   "Gottlieb",
		},
		{
			CommonName: "Earnest Torp",
			Email:      "earnest.torp@local.fake",
			EuaUserID:  "TD4Z",
			FirstName:  "Earnest",
			LastName:   "Torp",
		},
		{
			CommonName: "Cecelia Hahn",
			Email:      "cecelia.hahn@local.fake",
			EuaUserID:  "HGDS",
			FirstName:  "Cecelia",
			LastName:   "Hahn",
		},
		{
			CommonName: "Desmond Nolan",
			Email:      "desmond.nolan@local.fake",
			EuaUserID:  "N60U",
			FirstName:  "Desmond",
			LastName:   "Nolan",
		},
		{
			CommonName: "Karianne Hickle",
			Email:      "karianne.hickle@local.fake",
			EuaUserID:  "HYG2",
			FirstName:  "Karianne",
			LastName:   "Hickle",
		},
		{
			CommonName: "Isobel Koelpin",
			Email:      "isobel.koelpin@local.fake",
			EuaUserID:  "KT77",
			FirstName:  "Isobel",
			LastName:   "Koelpin",
		},
		{
			CommonName: "Isidro Swaniawski",
			Email:      "isidro.swaniawski@local.fake",
			EuaUserID:  "SM7H",
			FirstName:  "Isidro",
			LastName:   "Swaniawski",
		},
	}
}

// FetchUserInfo fetches a user's personal details
func (c *client) FetchUserInfo(_ context.Context, username string) (*models.UserInfo, error) {
	if username == "" {
		return nil, &apperrors.ValidationError{
			Err:     errors.New("invalid EUA ID"),
			Model:   username,
			ModelID: username,
		}
	}
	c.logger.Info("Mock FetchUserInfo from Okta API", zap.String("username", username))
	for _, mockUser := range getMockUserData() {
		if mockUser.EuaUserID == username {
			return mockUser, nil
		}
	}
	return nil, &apperrors.ExternalAPIError{
		Err:       errors.New("failed to return person from Okta API"),
		ModelID:   username,
		Model:     models.UserInfo{},
		Operation: apperrors.Fetch,
		Source:    "Okta API",
	}
}

// SearchCommonNameContains fetches a user's personal details by their common name
func (c *client) SearchCommonNameContains(_ context.Context, commonName string) ([]*models.UserInfo, error) {
	c.logger.Info("Mock SearchCommonNameContains from LDAP")

	mockUserData := getMockUserData()
	searchResults := []*models.UserInfo{}

	for _, element := range mockUserData {
		lowerName := strings.ToLower(element.CommonName)
		lowerSearch := strings.ToLower(commonName)
		if strings.Contains(lowerName, lowerSearch) {
			searchResults = append(searchResults, element)
		}
	}

	return searchResults, nil
}
