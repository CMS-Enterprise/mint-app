import {
  TranslationField,
  TranslationFieldPropertiesWithOptions
} from 'types/translation';

export const hasOptions = (
  options: TranslationField
): options is TranslationFieldPropertiesWithOptions =>
  !!(options as any).options;

export const translateBoolean = (bool: boolean) => bool.toString();

export default hasOptions;
