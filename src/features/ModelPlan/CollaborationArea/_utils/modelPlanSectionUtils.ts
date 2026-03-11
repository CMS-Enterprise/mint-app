import {
  GetCollaborationAreaQuery,
  TaskStatus,
  UserAccount
} from 'gql/generated/graphql';

import TaskListSectionKeys from 'constants/enums';

type ModelPlan = GetCollaborationAreaQuery['modelPlan'];

type SectionWithModified = ModelPlan[keyof ModelPlan] & {
  modifiedDts: string;
  modifiedByUserAccount: UserAccount;
};

/**
 * Returns the section with the most recent modifiedDts, or undefined if none.
 */
export const getLastModifiedSection = (
  modelPlan: ModelPlan | undefined
): SectionWithModified | null | undefined => {
  if (!modelPlan) return null;
  let latestSection: SectionWithModified | undefined;
  (TaskListSectionKeys as (keyof ModelPlan)[]).forEach(section => {
    const sectionData = modelPlan[section] as SectionWithModified | null;
    if (
      sectionData?.modifiedDts &&
      sectionData.modifiedDts > (latestSection?.modifiedDts || '')
    ) {
      latestSection = sectionData;
    }
  });
  return latestSection;
};

/**
 * Returns the number of sections that have been started (i.e. not in 'READY' status).
 */
export const getSectionStartedCount = (modelPlan: ModelPlan): number => {
  return (TaskListSectionKeys as (keyof ModelPlan)[]).filter(key => {
    // Safely access the section by restricting keys to keyof ModelPlan
    const section = modelPlan[key] as { status?: TaskStatus } | undefined;
    return section?.status !== TaskStatus.READY;
  }).length;
};
