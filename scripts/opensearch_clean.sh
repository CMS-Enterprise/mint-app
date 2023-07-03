#!/bin/bash

# Get the latest version of OpenSearch CLI
VERSION="1.1.0"
DOWNLOAD_URL="https://github.com/opensearch-project/opensearch-cli/releases/download/${VERSION}/opensearch-cli-${VERSION}-linux-x64.zip"

# Download the file
wget -O ~/.local/opensearch-cli.zip ${DOWNLOAD_URL}  && \\
unzip -o ~/.local/opensearch-cli.zip -d ~/.local/ && \\
rm ~/.local/opensearch-cli.zip

# Confirm that the CLI is working properly
~/.local/opensearch-cli --version

mkdir ~/.opensearch-cli
cat << EOF > ~/.opensearch-cli/config.yaml
profiles:
    - name: default
      endpoint: "${OPENSEARCH_ENDPOINT}"
      user: mint-admin
      password: "${OPENSEARCH_PASSWORD}"
      max_retry: 3
      timeout: 10
EOF

chmod 0600 ~/.opensearch-cli/config.yaml

# Delete the index to clear data
~/.local/opensearch-cli curl delete -P "/change_table_idx" --pretty -p default

# Immediately recreate index
~/.local/opensearch-cli curl put -P "/change_table_idx" --pretty -p default