import {
  TranslationFieldObject,
  TranslationFieldObjectOptions
} from 'types/translation';

export const hasOptions = (
  options: TranslationFieldObject
): options is TranslationFieldObjectOptions => !!(options as any).options;

export default hasOptions;
