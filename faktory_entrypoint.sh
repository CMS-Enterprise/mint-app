#!/bin/sh

# Ensure FAKTORY_CRON_TOML_BASE64 is set, if not, we shouldn't start the service.
if [ -z "${FAKTORY_CRON_TOML_BASE64}" ]; then
	echo "Unable to start Faktory without setting FAKTORY_CRON_TOML_BASE64"
	exit 1
fi

# Copy CRON TOML config from environment variable into file for Faktory service to read
mkdir /etc/faktory/conf.d
echo "$FAKTORY_CRON_TOML_BASE64" | base64 -d > /etc/faktory/conf.d/cron.toml

# Start Faktory
/faktory -w 0.0.0.0:7420 -b 0.0.0.0:7419