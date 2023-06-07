export type TranslationFieldObjectFreeText = {
  gqlField: string;
  goField: string;
  dbField: string;
  question: string;
  hint?: string;
  dataType: 'string' | 'boolean' | 'date' | 'enum';
  formType:
    | 'text'
    | 'textarea'
    | 'number'
    | 'boolean'
    | 'radio'
    | 'checkbox'
    | 'select'
    | 'multiselect'
    | 'rangeInput';
  tags?: string[];
};

export type TranslationFieldObjectOptions = TranslationFieldObjectFreeText & {
  options: Record<string, string>;
};

export type TranslationFieldObject =
  | TranslationFieldObjectFreeText
  | TranslationFieldObjectOptions;
