import {
  GetCollaborationAreaQuery,
  PlanTaskKey,
  TaskStatus,
  UserAccount
} from 'gql/generated/graphql';

import TaskListSectionKeys from 'constants/enums';

import type { LastModifiedSectionData } from '../_components/LastModifiedSection';

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

/**
 * Returns the most recent edit (timestamp and editor) for the area of the model
 * plan that a collaboration task represents: model-plan sections (via
 * {@link getLastModifiedSection}), MTO matrix activity, or the data exchange
 * questionnaire. Returns null when there is no edit data for that task.
 */
export function getLastEditSectionForTask(
  taskKey: PlanTaskKey,
  modelPlan: ModelPlan
): LastModifiedSectionData | null {
  if (taskKey === PlanTaskKey.MODEL_PLAN) {
    return getLastModifiedSection(modelPlan) ?? null;
  }
  if (taskKey === PlanTaskKey.MTO) {
    const recentEdit = modelPlan?.mtoMatrix?.recentEdit;
    if (recentEdit?.date) {
      return {
        modifiedDts: recentEdit.date,
        modifiedByUserAccount: {
          commonName: recentEdit.actorName ?? ''
        }
      };
    }
    return null;
  }
  if (taskKey === PlanTaskKey.DATA_EXCHANGE) {
    const dataExchangeApproach =
      modelPlan?.questionnaires?.dataExchangeApproach;
    if (
      dataExchangeApproach?.modifiedDts &&
      dataExchangeApproach.modifiedByUserAccount?.commonName
    ) {
      return {
        modifiedDts: dataExchangeApproach.modifiedDts,
        modifiedByUserAccount: {
          commonName: dataExchangeApproach.modifiedByUserAccount.commonName
        }
      };
    }
    return null;
  }
  return null;
}
