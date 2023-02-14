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

func (b *Backfiller) translateFile(table *DataTable) (*[]BackfillEntry, error) {

	entries := []BackfillEntry{}

	for i := 0; i < len(table.Rows); i++ {
		row := table.Rows[i]
		entry := b.translateDataRow(&row)
		entries = append(entries, *entry)

	}

	return &entries, nil
}

func (b *Backfiller) translateDataRow(row *DataRow) *BackfillEntry {
	entry := NewBackFillEntry()
	for key, value := range row.Fields {

		translation := b.TDictionary.getTranslation(key)
		translation.handleTranslation(&entry, value, b)
	}
	return &entry

}
