import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  SummaryBox
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Divider from 'components/shared/Divider';
import GetModelPlanQuery from 'queries/GetModelPlanQuery';
import {
  GetModelPlan,
  GetModelPlanVariables
} from 'queries/types/GetModelPlan';

import TaskListCta from './components/TaskListCta';
import TaskListItem, { TaskListDescription } from './components/TaskListItem';
import TaskListSideNav from './components/TaskListSideNav';

import './index.scss';

type TaskListItemProps = {
  heading: string;
  copy: string;
};

const TaskList = () => {
  const { t } = useTranslation('modelPlanTaskList');
  const { modelId } = useParams<{ modelId: string }>();

  const { data } = useQuery<GetModelPlan, GetModelPlanVariables>(
    GetModelPlanQuery,
    {
      variables: {
        id: modelId
      }
    }
  );

  const { modelName, basics } = data?.modelPlan || {};

  const taskListItem: TaskListItemProps[] = t('numberedList', {
    returnObjects: true
  });

  return (
    <MainContent
      className="model-plan-task-list grid-container margin-bottom-7"
      data-testid="model-plan-task-list"
    >
      <div className="grid-row">
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>{t('navigation.home')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>{t('navigation.modelPlanTaskList')}</Breadcrumb>
        </BreadcrumbBar>
      </div>
      <div className="grid-row grid-gap-lg">
        <div className="tablet:grid-col-9">
          <PageHeading className="margin-bottom-0">
            {t('navigation.modelPlanTaskList')}
          </PageHeading>
          <p className="margin-top-0 margin-bottom-2 font-body-lg">
            <Trans i18nKey="modelPlanTaskList:subheading">
              indexZero {modelName} indexTwo
            </Trans>
          </p>
          <SummaryBox
            heading=""
            className="bg-base-lightest border-0 radius-0 padding-2"
          >
            <p className="margin-0 margin-bottom-1">
              <Trans i18nKey="modelPlanTaskList:summaryBox.copy">
                indexZero {modelName} indexTwo
              </Trans>
            </p>
            <UswdsReactLink
              className="usa-button usa-button--outline"
              variant="unstyled"
              to="/"
            >
              {t('summaryBox.cta')}
            </UswdsReactLink>
          </SummaryBox>
          <ol
            data-testid="task-list"
            className="model-plan-task-list__task-list model-plan-task-list__task-list--primary margin-y-6"
          >
            {Object.keys(taskListItem).map((key: any) => {
              const lastTaskItem = Object.keys(taskListItem).slice(-1)[0];

              return (
                <>
                  <TaskListItem
                    key={key}
                    testId="task-list-intake-form"
                    heading={taskListItem[key].heading}
                    status="READY"
                  >
                    <TaskListDescription>
                      <p className="margin-top-0">{taskListItem[key].copy}</p>
                    </TaskListDescription>
                    {/* <TaskListCta intake={systemIntake} /> */}
                    <TaskListCta status="READY" />
                  </TaskListItem>
                  {key !== lastTaskItem && (
                    <Divider className="margin-bottom-4" />
                  )}
                </>
              );
            })}
          </ol>
        </div>
        <div className="tablet:grid-col-3">
          {/* <SideNavActions intake={systemIntake} archiveIntake={archiveIntake} /> */}
          <TaskListSideNav />
        </div>
      </div>
    </MainContent>
  );
};

export default TaskList;
