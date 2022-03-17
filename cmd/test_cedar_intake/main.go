package main

import (
	"fmt"
	"os"
	"time"

	ld "gopkg.in/launchdarkly/go-server-sdk.v5"
	"gopkg.in/launchdarkly/go-server-sdk.v5/ldcomponents"
	"gopkg.in/launchdarkly/go-server-sdk.v5/testhelpers/ldtestdata"

	"github.com/cmsgov/easi-app/pkg/appconfig"
	"github.com/cmsgov/easi-app/pkg/cedar/intake"
)

type testData struct {
}

// borrowed from cmd/devdata/main.go
func date(year, month, day int) *time.Time {
	date := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
	return &date
}

func makeCedarIntakeClient() *intake.Client {
	cedarAPIHost := os.Getenv(appconfig.CEDARAPIURL)
	cedarAPIKey := os.Getenv(appconfig.CEDARAPIKey)

	td := ldtestdata.DataSource()
	td.Update(td.Flag("emit-to-cedar").BooleanFlag().VariationForAllUsers(true))
	config := ld.Config{
		DataSource: td,
		Events:     ldcomponents.NoEvents(),
	}

	ldClient, err := ld.MakeCustomClient("fake", config, 0)
	if err != nil {
		fmt.Println(err)
		panic("Error initializing ldClient")
	}

	client := intake.NewClient(cedarAPIHost, cedarAPIKey, ldClient)
	return client
}

func noErr(err error) {
	if err != nil {
		fmt.Println("Error!")
		fmt.Println(err)
		panic("Aborting")
	}
}

func main() {
	//zapLogger, err := zap.NewDevelopment()
	//noErr(err)

	//ctx := appcontext.WithLogger(context.Background(), zapLogger)
}
