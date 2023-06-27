/* eslint-disable no-redeclare */

/*
Custom hook for question configuration and typed translation mappings for iterative rendering
Fetches i18n store and returns a model plan translation section or all translations
*/

import { useTranslation } from 'react-i18next';
import { ResourceKey } from 'i18next';

import { TranslationPlan } from 'types/translation';

// Function overload
// Conditionally return type based parameter
function usePlanTranslation(type?: undefined): TranslationPlan;
function usePlanTranslation<T extends keyof TranslationPlan>(
  type?: T
): TranslationPlan[T];
function usePlanTranslation<T extends keyof TranslationPlan>(
  type?: T
): TranslationPlan[T] | TranslationPlan {
  const translationStore: ResourceKey = useTranslation().i18n.store;

  // Get the translations for the set browser language
  const planTranslationMap: TranslationPlan =
    translationStore.data[navigator.language];

  // If requesting a single task list section, return only those translations
  if (type) {
    return planTranslationMap[type] as TranslationPlan[T];
  }

  // Return all translations for all sections
  return planTranslationMap as TranslationPlan;
}

export default usePlanTranslation;
