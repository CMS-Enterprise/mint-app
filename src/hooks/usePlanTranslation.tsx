/* eslint-disable no-redeclare */

// Custom hook for question configuration and typed translation mappings for iterative rendering

import { useTranslation } from 'react-i18next';
import { ResourceKey } from 'i18next';

import { TranslationPlan } from 'types/translation';

function usePlanTranslation(type?: undefined): TranslationPlan;
function usePlanTranslation<T extends keyof TranslationPlan>(
  type?: T
): TranslationPlan[T];
function usePlanTranslation<T extends keyof TranslationPlan>(
  type?: T
): TranslationPlan[T] | TranslationPlan {
  const translationStore: ResourceKey = useTranslation().i18n.store;

  const planTranslationMap: TranslationPlan =
    translationStore.data[navigator.language];

  if (type) {
    return planTranslationMap[type] as TranslationPlan[T];
  }

  return planTranslationMap as TranslationPlan;
}

export default usePlanTranslation;
