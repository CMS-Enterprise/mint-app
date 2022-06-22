package enumArray

import (
	// "fmt"
	"fmt"
	"go/types"

	// "sort"
	"strings"

	// "github.com/99designs/gqlgen/codegen/config"
	// "github.com/99designs/gqlgen/codegen/templates"
	"github.com/99designs/gqlgen/plugin"
	"github.com/vektah/gqlparser/v2/ast"
)

type BuildMutateHook = func(b *ModelBuild) *ModelBuild

type FieldMutateHook = func(td *ast.Definition, fd *ast.FieldDefinition, f *Field) (*Field, error)

// defaultFieldMutateHook is the default hook for the Plugin which applies the GoTagFieldHook.
func defaultFieldMutateHook(td *ast.Definition, fd *ast.FieldDefinition, f *Field) (*Field, error) {
	return GoTagFieldHook(td, fd, f)
}

func defaultBuildMutateHook(b *ModelBuild) *ModelBuild {
	return b
}

type ModelBuild struct {
	PackageName string
	Interfaces  []*Interface
	Models      []*Object
	Enums       []*Enum
	Scalars     []string
}

type Interface struct {
	Description string
	Name        string
	Implements  []string
}

type Object struct {
	Description string
	Name        string
	Fields      []*Field
	Implements  []string
}

type Field struct {
	Description string
	// Name is the field's name as it appears in the schema
	Name string
	// GoName is the field's name as it appears in the generated Go code
	GoName string
	Type   types.Type
	Tag    string
}

type Enum struct {
	Description string
	Name        string
	Values      []*EnumValue
}

type EnumValue struct {
	Description string
	Name        string
}

func New() plugin.Plugin {
	return &Plugin{
		MutateHook: defaultBuildMutateHook,
		FieldHook:  defaultFieldMutateHook,
	}
}

type Plugin struct {
	MutateHook BuildMutateHook
	FieldHook  FieldMutateHook
}

func (m *Plugin) Name() string {
	return "enumArray"
}

// GoTagFieldHook applies the goTag directive to the generated Field f. When applying the Tag to the field, the field
// name is used when no value argument is present.
func GoTagFieldHook(td *ast.Definition, fd *ast.FieldDefinition, f *Field) (*Field, error) {
	args := make([]string, 0)
	for _, goTag := range fd.Directives.ForNames("goTag") {
		key := ""
		value := fd.Name

		if arg := goTag.Arguments.ForName("key"); arg != nil {
			if k, err := arg.Value.Value(nil); err == nil {
				key = k.(string)
			}
		}

		if arg := goTag.Arguments.ForName("value"); arg != nil {
			if v, err := arg.Value.Value(nil); err == nil {
				value = v.(string)
			}
		}

		args = append(args, key+":\""+value+"\"")
		fmt.Print("Found goTag Array Directive")
		fmt.Print(key, value)

	}

	for _, enumArray := range fd.Directives.ForNames("enumArray") {

		fmt.Print("Found enum Array Directive")
		if arg := enumArray.Arguments.ForName("enumType"); arg != nil {
			if enum, err := arg.Value.Value(nil); err == nil {
				enum = enum.(string)
			}

		}
	}

	if len(args) > 0 {
		f.Tag = f.Tag + " " + strings.Join(args, " ")
	}

	return f, nil
}
