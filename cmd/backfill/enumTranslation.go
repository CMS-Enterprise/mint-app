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

// NewEmumTranslationDictionary converts an array of Enum Translations to a Dictionary
func NewEmumTranslationDictionary(enumTranslations []EmumTranslation) *EmumTranslationDictionary {
	EnumTranslationD := EmumTranslationDictionary{}
	for i := 0; i < len(enumTranslations); i++ {
		EnumTranslationD[enumTranslations[i].Value] = &enumTranslations[i] //TODO I THINK THESE VALUES MIGHT BE SHARED.., maybe need to key on model and value?
	}
	return &EnumTranslationD
}

func (etd EmumTranslationDictionary) tryGetEnumByValue(value string) *EmumTranslation {

	enumVal := etd[value]
	// dictionary := pd.(map[string])

	if enumVal == nil {

		enumKey, found := lo.FindKeyBy(etd, func(i string, enumTrans *EmumTranslation) bool {
			return strings.Contains(enumTrans.Outliers, value) //TODO revist this and make sure we retun the correct value
		})
		if found {
			enumVal = etd[enumKey]
		}

	}
	return enumVal

}
