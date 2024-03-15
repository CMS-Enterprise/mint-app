// Package main is a temporary test package to validate the translations package.
package main

import (
	"encoding/json"
	"fmt"
	"os"
)

func main() {
	filepath := "/Users/cloak/repos/mint-app/shared_mappings/participantsAndProviders.json"
	// Read JSON data from file
	fileData, err := os.ReadFile(filepath)
	if err != nil {
		fmt.Println("Error reading file:", err)
		return
	}

	// Define your struct for TranslationParticipantsAndProviders here...

	// Deserialize JSON data into struct
	var participantsTranslation TranslationParticipantsAndProviders
	err = json.Unmarshal(fileData, &participantsTranslation)
	if err != nil {
		fmt.Println("Error unmarshalling JSON:", err)
		return
	}

	// Print the deserialized struct
	fmt.Println(participantsTranslation.Participants)
}
