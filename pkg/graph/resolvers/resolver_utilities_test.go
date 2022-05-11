package resolvers

import (
	"testing"

	"github.com/google/uuid"
	_ "github.com/lib/pq" // required for postgres driver in sql
	"github.com/stretchr/testify/assert"
)

type Person struct {
	Name      string   `json:"name"`
	Age       int      `json:"age"`
	Nicknames []string `json:"nicknames"`
}

func TestApplyChanges(t *testing.T) {
	clay := Person{"Clay", 27, []string{"Clayboy", "Claysadilla"}}

	clayChanges := map[string]interface{}{
		"age": 28,
	}
	err := ApplyChanges(clayChanges, &clay)
	if err != nil {
		t.Errorf("ApplyChanges failed: %s", err)
	}
	assert.Equal(t, "Clay", clay.Name)
	assert.Equal(t, 28, clay.Age)
	assert.Equal(t, []string{"Clayboy", "Claysadilla"}, clay.Nicknames)

	clayChanges = map[string]interface{}{
		"nicknames": []string{},
	}
	err = ApplyChanges(clayChanges, &clay)
	if err != nil {
		t.Errorf("ApplyChanges failed: %s", err)
	}
	assert.Equal(t, "Clay", clay.Name)
	assert.Equal(t, 28, clay.Age)
	assert.Equal(t, []string{}, clay.Nicknames)

	clayChanges = map[string]interface{}{
		"nicknames": []string{"Clayson the Wise"},
		"age":       50,
	}
	err = ApplyChanges(clayChanges, &clay)
	if err != nil {
		t.Errorf("ApplyChanges failed: %s", err)
	}
	assert.Equal(t, "Clay", clay.Name)
	assert.Equal(t, 50, clay.Age)
	assert.Equal(t, []string{"Clayson the Wise"}, clay.Nicknames)
}

type PersonWithUUID struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

// TestApplyChangesUUID tests that ApplyChanges works with UUIDs
// Note that this isn't how GQL passes UUIDs to resolvers, but is something we hackily use
// in tests to modify the ID of an entity.
func TestApplyChangesUUID(t *testing.T) {
	clay := PersonWithUUID{uuid.MustParse("cfe0965f-aa95-4ade-af54-838a85cc6644"), "Clay"}

	// decodeData, decodeErr := hex.DecodeString("02a9920eb0154de38e32fb965ac4653c")
	// if decodeErr != nil {
	// 	t.Errorf("Failed to decode UUID: %s", decodeErr)
	// }
	clayChanges := map[string]interface{}{
		"id": []byte{0x2, 0xa9, 0x92, 0xe, 0xb0, 0x15, 0x4d, 0xe3, 0x8e, 0x32, 0xfb, 0x96, 0x5a, 0xc4, 0x65, 0x3c},
	}
	err := ApplyChanges(clayChanges, &clay)
	if err != nil {
		t.Errorf("ApplyChanges failed: %s", err)
	}
	assert.Equal(t, "02a9920e-b015-4de3-8e32-fb965ac4653c", clay.ID.String())
	assert.Equal(t, "Clay", clay.Name)
}
