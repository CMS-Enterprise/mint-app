package main

// Backfiller is a type which holds all the dictionaries needed to translate and upload data to the db.
type Backfiller struct {
	TDictionary    *TranslationsDictionary
	UDictionary    *PossibleUserDictionary
	EnumDictionary *EmumTranslationDictionary
}

// NewBackfiller returns a new Backfiller with the needed dictionaries
func NewBackfiller(tDict *TranslationsDictionary, uDict *PossibleUserDictionary, eDict *EmumTranslationDictionary) *Backfiller {
	return &Backfiller{
		TDictionary:    tDict,
		UDictionary:    uDict,
		EnumDictionary: eDict,
	}
}
