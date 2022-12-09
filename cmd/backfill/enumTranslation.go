package main

import (
	"strings"

	"github.com/samber/lo"
)

// EmumTranslation maps a sharpoint enum option to a valid MINT option
type EmumTranslation struct {
	Value    string
	Enum     string
	DBType   string
	Model    string
	Field    string
	Outliers string
	Note     string
}

// EmumTranslationDictionary is a mapping of enumTranslations
type EmumTranslationDictionary map[string]*EmumTranslation

func (et *EmumTranslation) Key() string {
	return et.Model + strings.Title(et.Field) + et.Value
}

// NewEmumTranslationDictionary converts an array of Enum Translations to a Dictionary
func NewEmumTranslationDictionary(enumTranslations []EmumTranslation) *EmumTranslationDictionary {
	EnumTranslationD := EmumTranslationDictionary{}
	for i := 0; i < len(enumTranslations); i++ {
		EnumTranslationD[enumTranslations[i].Key()] = &enumTranslations[i]
	}
	return &EnumTranslationD
}

func (etd EmumTranslationDictionary) tryGetEnumByValue(value string, translation *Translation) (*EmumTranslation, bool) {

	key := translation.ModelName + translation.Field + value

	enumVal, found := etd[key]
	// dictionary := pd.(map[string])

	if enumVal == nil {

		enumKey, found := lo.FindKeyBy(etd, func(i string, enumTrans *EmumTranslation) bool {
			//TODO revist this and make sure we retun the correct value

			return strings.Contains(enumTrans.Outliers, value) && enumTrans.Model == translation.ModelName && enumTrans.Field == translation.Field
		})
		if found {
			enumVal = etd[enumKey]
		}

	}
	return enumVal, found

}
