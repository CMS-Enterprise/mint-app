#!/bin/bash
set -euo pipefail

get_opensearch_cli() {
  local version="1.1.0"
  local download_url="https://github.com/opensearch-project/opensearch-cli/releases/download/${version}/opensearch-cli-${version}-linux-x64.zip"
  local download_path="$HOME/.local/opensearch-cli.zip"
  local extraction_path="$HOME/.local/"

  echo "Downloading OpenSearch CLI version $version..."

  wget -O "$download_path" "$download_url"

  echo "Extracting OpenSearch CLI..."

  unzip -o "$download_path" -d "$extraction_path" && rm "$download_path"
}

verify_cli() {
  echo "Verifying OpenSearch CLI..."

  "$HOME/.local/opensearch-cli" --version || {
    echo "CLI verification failed!"
    exit 1
  }
}

configure_cli() {
  local endpoint="$1"
  local password="$2"
  local config_path="$HOME/.opensearch-cli/config.yaml"

  mkdir -p "$HOME/.opensearch-cli"

  cat > "$config_path" << EOF
profiles:
    - name: default
      endpoint: "${endpoint}"
      user: mint-admin
      password: "${password}"
      max_retry: 3
      timeout: 10
EOF

  chmod 0600 "$config_path"
}

clear_index() {
  local index_name="/change_table_idx"
  local profile_name="default"

  echo "Clearing index $index_name..."

  "$HOME/.local/opensearch-cli" curl delete -P "$index_name" --pretty -p "$profile_name"

  echo "Recreating index $index_name..."

  "$HOME/.local/opensearch-cli" curl put -P "$index_name" --pretty -p "$profile_name"
}

main() {
  if [[ $# -ne 2 ]]; then
    echo "Usage: $0 OPENSEARCH_ENDPOINT OPENSEARCH_PASSWORD"
    exit 1
  fi

  local endpoint="$1"
  local password="$2"

  get_opensearch_cli
  verify_cli
  configure_cli "$endpoint" "$password"
  clear_index
}

main "$@"
