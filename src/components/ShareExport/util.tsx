import i18next from 'i18next';

import { ExtendedModelShareSection } from 'hooks/useFetchCSVData';
import { getKeys } from 'types/translation';

type ExportSectionOption = {
  value: ExtendedModelShareSection;
  label: string;
};

const exportSectionOptions: ExportSectionOption[] = getKeys(
  ExtendedModelShareSection
).map(key => ({
  value: ExtendedModelShareSection[key],
  label: i18next.t(
    `generalReadOnly:modal.exportSections.${ExtendedModelShareSection[key]}`
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
  ExtendedModelShareSection,
  ModelSubSectionRouteKey[]
> = {
  [ExtendedModelShareSection.ALL]: [
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
  ],
  [ExtendedModelShareSection.MODEL_PLAN]: [
    'model-basics',
    'general-characteristics',
    'participants-and-providers',
    'beneficiaries',
    'operations-evaluation-and-learning',
    'payment'
  ],
  [ExtendedModelShareSection.MTO_ALL]: [
    'milestones',
    'it-systems-and-solutions'
  ],
  [ExtendedModelShareSection.MTO_MILESTONES]: ['milestones'],
  [ExtendedModelShareSection.MTO_SOLUTIONS]: ['it-systems-and-solutions']
};

export default exportSectionOptions;
