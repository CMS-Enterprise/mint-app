import {
  TranslationField,
  TranslationFieldPropertiesWithOptions
} from 'types/translation';

export const hasOptions = (
  options: TranslationField
): options is TranslationFieldPropertiesWithOptions =>
  !!(options as any).options;

export default hasOptions;
