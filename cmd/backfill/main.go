package main

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"os"
)

const (
	envFile     = "BACKFILL_FILE"
	envHost     = "BACKFILL_HOST"
	envAuth     = "BACKFILL_AUTH"
	envDrop     = "BACKFILL_DROP"
	healthcheck = "%s/api/v1/healthcheck"
)

type config struct {
	file string
	host string
	auth string
}

func main() {
	cfg := &config{
		file: os.Getenv(envFile),
		host: os.Getenv(envHost),
		auth: os.Getenv(envAuth),
	}
	if err := execute(cfg); err != nil {
		os.Exit(1)
	}
}

func execute(cfg *config) error {
	url := fmt.Sprintf(healthcheck, cfg.host)

	/* #nosec G107 - we need to have the URL for the API be provided at runtime */
	if _, err := http.Get(url); err != nil {
		return fmt.Errorf("failed healthcheck for [%s]: %w", url, err)
	}

	f, err := os.Open(cfg.file)
	if err != nil {
		return err
	}
	src := csv.NewReader(f)
	row, err := src.Read()
	if err != nil {
		return fmt.Errorf("failed to read column headers for [%s]: %w", cfg.file, err)
	}
	_ = row

	return nil
}
