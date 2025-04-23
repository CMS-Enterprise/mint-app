import { ModelShareSection } from 'gql/generated/graphql';
import i18next from 'i18next';

import { getKeys } from 'types/translation';

type ExportSectionOption = {
  value: ModelShareSection;
  label: string;
};

const exportSectionOptions: ExportSectionOption[] = getKeys(
  ModelShareSection
).map(key => ({
  value: ModelShareSection[key],
  label: i18next.t(
    `generalReadOnly:modal.exportSections.${ModelShareSection[key]}`
  )
}));

export const modelSectionRouteKey: string[] = [
  'model-basics',
  'general-characteristics',
  'participants-and-providers',
  'beneficiaries',
  'operations-evaluation-and-learning',
  'payment',
  'milestones',
  'it-systems-and-solutions',
  'team',
  'discussions',
  'documents',
  'crs-and-tdl',
  'data-exchange-approach'
];

export type ModelSubSectionRouteKey = (typeof modelSectionRouteKey)[number];

export const modelPlanSectionMappings: Record<
  ModelShareSection,
  ModelSubSectionRouteKey[]
> = {
  [ModelShareSection.MODEL_PLAN]: [
    'model-basics',
    'general-characteristics',
    'participants-and-providers',
    'beneficiaries',
    'operations-evaluation-and-learning',
    'payment'
  ],
  [ModelShareSection.MTO_ALL]: ['milestones', 'it-systems-and-solutions'],
  [ModelShareSection.MTO_MILESTONES]: ['milestones'],
  [ModelShareSection.MTO_SOLUTIONS]: ['it-systems-and-solutions']
};

export default exportSectionOptions;
