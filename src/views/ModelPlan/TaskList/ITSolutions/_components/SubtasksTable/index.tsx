/*
Subtask Table component and links component
Columns split between 'Todo', 'In progress', and 'Done'
If no subtasks, renders text for no subtasks
*/

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Grid, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { OperationalSolutionSubtaskStatus } from 'gql/gen/graphql';

type SubtaskType = {
  name: string;
  status: OperationalSolutionSubtaskStatus;
};

// Used for label translations
const columnTypes = {
  todo: OperationalSolutionSubtaskStatus.TODO,
  inProgress: OperationalSolutionSubtaskStatus.IN_PROGRESS,
  done: OperationalSolutionSubtaskStatus.DONE
};

type SubtaskColumnsProps = {
  subtasks: SubtaskType[];
  status: keyof typeof columnTypes;
};

// Returns ul list component with subtask name
const SubtaskColumns = ({
  subtasks,
  status
}: SubtaskColumnsProps): JSX.Element => {
  const { t } = useTranslation('opSolutionsMisc');

  return (
    <Grid
      desktop={{ col: 4 }}
      className={classNames({ 'border-right': status !== 'done' })}
    >
      <div className="border-bottom">
        <p className="text-bold padding-x-1 margin-y-105">
          {t(`subtasks.status.${status}`)}
        </p>
      </div>

      <div className="border-top" data-testid={status}>
        {subtasks.length === 0 &&
        columnTypes[status] === OperationalSolutionSubtaskStatus.TODO ? (
          <div className="padding-x-1 margin-y-105">
            {t('subtasks.status.noSubtasks')}
          </div>
        ) : (
          <>
            {subtasks.filter(
              (subtask: SubtaskType) => subtask.status === columnTypes[status]
            ).length !== 0 && (
              <ul>
                {subtasks
                  .filter(
                    (subtask: SubtaskType) =>
                      subtask.status === columnTypes[status]
                  )
                  .map((subtask: SubtaskType) => (
                    <li key={subtask.name} className="margin-y-1">
                      {subtask.name}
                    </li>
                  ))}
              </ul>
            )}
          </>
        )}
      </div>
    </Grid>
  );
};

type SubtaskLinksType = {
  [key: string]: string;
  addSubtasks: 'add-subtasks';
  manageSubtasks: 'manage-subtasks';
};

// Additional links beneath subtask table for adding and managing subtasks
export const SubtaskLinks = ({
  className,
  subtasks
}: {
  className?: string;
  subtasks: SubtaskType[];
}) => {
  const { t } = useTranslation('opSolutionsMisc');
  const { modelID, operationalNeedID, operationalSolutionID } = useParams<{
    modelID: string;
    operationalNeedID: string;
    operationalSolutionID: string;
  }>();

  const history = useHistory();

  const subtaskLinks: SubtaskLinksType = {
    addSubtasks: 'add-subtasks',
    manageSubtasks: 'manage-subtasks'
  };

  return (
    <div className={classNames(className, 'display-flex')}>
      {Object.keys(subtaskLinks).map(link => {
        if (subtasks.length === 0 && link === 'manageSubtasks')
          return <React.Fragment key="none" />;

        return (
          <Button
            key={link}
            type="button"
            id={subtaskLinks[link]}
            className="usa-button usa-button--outline"
            onClick={() => {
              history.push(
                `/models/${modelID}/collaboration-area/task-list/it-solutions/${operationalNeedID}/${operationalSolutionID}/${subtaskLinks[link]}`
              );
            }}
          >
            {t(`subtasks.status.${link}`)}
          </Button>
        );
      })}
    </div>
  );
};

type SubtasksProps = {
  subtasks: SubtaskType[];
  className?: string;
};

const SubtasksTable = ({ subtasks, className }: SubtasksProps) => {
  const { t } = useTranslation('opSolutionsMisc');

  return (
    <div className={classNames(className)}>
      <h3 className="margin-top-0">{t('subtasks.status.header')}</h3>
      <SubtaskLinks
        className="margin-top-2 margin-bottom-3"
        subtasks={subtasks}
      />

      <GridContainer className="padding-0">
        <Grid row className="border">
          {/* TO_DO Subtasks */}
          <SubtaskColumns subtasks={subtasks} status="todo" />

          {/* IN_PROGRESS Subtasks */}
          <SubtaskColumns subtasks={subtasks} status="inProgress" />

          {/* DONE Subtasks */}
          <SubtaskColumns subtasks={subtasks} status="done" />
        </Grid>
      </GridContainer>
    </div>
  );
};

export default SubtasksTable;
