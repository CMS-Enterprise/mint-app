import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

type BreadcrumbItems = {
  text: string;
  url: string;
};

const breadcrumbItemOptions = [
  'home',
  'taskList',
  'collaborationArea',
  'notifications',
  'helpCenter',
  'basics',
  'generalCharacteristics',
  'participantsAndProviders',
  'beneficiaries',
  'opsEvalAndLearning',
  'payments',
  'itTracker',
  'prepareForClearance',
  'collaborators',
  'documents',
  'crTDLs',
  'status'
] as const;

type BreadcrumbItemOptions = typeof breadcrumbItemOptions[number];

export interface BreadcrumbsProps {
  className?: string;
  items: (BreadcrumbItemOptions | string)[];
}

export const commonBreadCrumbs = (
  modelID: string
): Record<BreadcrumbItemOptions, BreadcrumbItems> => ({
  home: {
    text: 'plan:home',
    url: '/'
  },
  taskList: {
    text: 'modelPlanTaskList:heading',
    url: `/models/${modelID}/task-list`
  },
  collaborationArea: {
    text: 'collaborationArea:heading',
    url: `/models/${modelID}/collaboration-area`
  },
  notifications: {
    text: 'notifications:breadcrumb',
    url: '/notifications'
  },
  helpCenter: {
    text: 'helpAndKnowledge:heading',
    url: '/help-and-knowledge'
  },
  basics: {
    text: 'basicsMisc:heading',
    url: `/models/${modelID}/task-list/basics`
  },
  generalCharacteristics: {
    text: 'generalCharacteristicsMisc:heading',
    url: `/models/${modelID}/task-list/characteristics`
  },
  participantsAndProviders: {
    text: 'participantsAndProvidersMisc:heading',
    url: `/models/${modelID}/task-list/participants-and-providers`
  },
  beneficiaries: {
    text: 'beneficiariesMisc:heading',
    url: `/models/${modelID}/task-list/beneficiaries`
  },
  opsEvalAndLearning: {
    text: 'opsEvalAndLearningMisc:heading',
    url: `/models/${modelID}/task-list/ops-eval-and-learning`
  },
  payments: {
    text: 'paymentsMisc:heading',
    url: `/models/${modelID}/task-list/payments`
  },
  itTracker: {
    text: 'opSolutionsMisc:heading',
    url: `/models/${modelID}/task-list/it-solutions`
  },
  prepareForClearance: {
    text: 'prepareForClearance:heading',
    url: `/models/${modelID}/task-list/prepare-for-clearance`
  },
  collaborators: {
    text: 'collaboratorsMisc:manageModelTeam',
    url: `/models/${modelID}/collaborators`
  },
  documents: {
    text: 'documentsMisc:heading',
    url: `/models/${modelID}/documents`
  },
  crTDLs: {
    text: 'crtdlsMisc:heading',
    url: `/models/${modelID}/cr-tdls`
  },
  status: {
    text: 'modelPlanMisc:headingStatus',
    url: `/models/${modelID}/status`
  }
});

// Check if the item is a common item, or a custom text string passed as the last option of item array
const isCommonItem = (
  item: BreadcrumbItemOptions | any
): item is BreadcrumbItemOptions => breadcrumbItemOptions.includes(item as any);

// Last item in the array can be a custom text string, so we need to check if it's a common item or not
const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  const { t } = useTranslation();

  const { modelID } = useParams<{
    modelID: string;
  }>();

  return (
    <BreadcrumbBar variant="wrap" className={classNames(className)}>
      {items.map((item, idx) => {
        if (idx === items.length - 1) {
          return (
            <Breadcrumb
              key={
                isCommonItem(item)
                  ? t(commonBreadCrumbs(modelID)[item].text)
                  : item
              }
              current
            >
              <span>
                {isCommonItem(item)
                  ? t(commonBreadCrumbs(modelID)[item].text)
                  : item}
              </span>
            </Breadcrumb>
          );
        }
        return (
          <Breadcrumb
            key={
              isCommonItem(item)
                ? t(commonBreadCrumbs(modelID)[item].text)
                : item
            }
          >
            <BreadcrumbLink
              asCustom={UswdsReactLink}
              to={
                isCommonItem(item) ? commonBreadCrumbs(modelID)[item].url : item
              }
            >
              <span>
                {isCommonItem(item)
                  ? t(commonBreadCrumbs(modelID)[item].text)
                  : item}
              </span>
            </BreadcrumbLink>
          </Breadcrumb>
        );
      })}
    </BreadcrumbBar>
  );
};

export default Breadcrumbs;
