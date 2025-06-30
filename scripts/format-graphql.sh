#!/bin/sh

# Filter only .graphql files from arguments
graphql_files=""
for file in "$@"; do
  case "$file" in
    *.graphql) graphql_files="$graphql_files \"$file\"" ;;
  esac
done

# If no graphql files, exit cleanly
if [ -z "$graphql_files" ]; then
  echo "No GraphQL files to format."
  exit 0
fi


# Run prettier check on these files
changed=$(eval yarn prettier --check $graphql_files 2>&1 )
echo "$changed" | awk '/^\[warn\] .*\.graphql$/ { sub(/^\[warn\] /, ""); print }'
changed_files_output=$(echo "$changed" | awk '/^\[warn\] .*\.graphql$/ { sub(/^\[warn\] /, ""); print }' | grep '.graphql')
if [ -n "$changed_files_output" ]; then
  echo "$changed_files_output"
  # format files and squash the output
  eval yarn prettier --write $graphql_files --log-level silent > /dev/null 2>&1

fi



# echo "$changed_files_output" | grep '.graphql'


# output=$(eval yarn prettier --write $graphql_files --log-level silent)
# # echo "$output"
# # Print only the changed files
# # Prettier returns each modified file path, so extract and print those
# changed_files=$(echo "$output" | grep -E '\.graphql$')
# # echo "$changed_files"
# if [ -n "$changed_files" ]; then
#   echo "Formatted the following GraphQL files:"
#   echo "$changed_files"
# fi

# # Exit with success
# exit 0

# # if [ $? -ne 0 ]; then
# #   echo "GraphQL formatting failed."
# #   exit 1
# # fi

