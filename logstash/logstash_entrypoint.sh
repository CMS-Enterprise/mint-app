#!/bin/sh

# Ensure FAKTORY_CRON_TOML_BASE64 is set, if not, we shouldn't start the service.
if [ -z "${LOGSTASH_CONF_BASE64}" ]; then
	echo "Unable to start Logstash without setting LOGSTASH_CONF_BASE64"
	exit 1
fi

# Copy Logstash config from environment variable into file for Logstash service to read
echo "$LOGSTASH_CONF_BASE64" | base64 -d > /usr/share/logstash/pipeline/logstash.conf

# Start Faktory
logstash -f /usr/share/logstash/pipeline/logstash.conf