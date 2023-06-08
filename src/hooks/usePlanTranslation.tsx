/* eslint-disable */
// Custom hook for question configuration and typed translation mappings for iterative rendering
import { useTranslation } from 'react-i18next';
import { ResourceKey } from 'i18next';

import {
  TranslationModelPlan,
  TranslationPlan,
  TranslationPlanBasics
} from 'types/translation';

interface TypeMap {
  model_plan: TranslationModelPlan;
  plan_basics: TranslationPlanBasics;
}

function usePlanTranslation(type?: undefined) : TranslationPlan;
function usePlanTranslation<T extends keyof TypeMap>(type?: T) : TypeMap[T];
function usePlanTranslation<T extends keyof TypeMap>(type?: T) : TypeMap[T] | TranslationPlan {
  const translationStore: ResourceKey = useTranslation().i18n.store;

  const planTranslationMap: TranslationPlan =
    translationStore.data[navigator.language];

  if (type) {
    return planTranslationMap[type] as TypeMap[T];
  }

  return planTranslationMap as TranslationPlan;
}

export default usePlanTranslation;
