package resolvers

import (
	"testing"

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
