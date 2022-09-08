import React, { Fragment, useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Grid, GridContainer, Label, TextInput } from '@trussworks/react-uswds';
import { Field } from 'formik';
import i18next from 'i18next';

import AddNote from 'components/AddNote';
import MainContent from 'components/MainContent';
import CheckboxField from 'components/shared/CheckboxField';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import { sortOtherEnum } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';
import {
  findLockedSection,
  taskListSectionMap
} from 'views/SubscriptionHandler';
import { SubscriptionContext } from 'views/SubscriptionWrapper';

import ITToolsPageEight from './PageEight';
import ITToolsPageFive from './PageFive';
import ITToolsPageFour from './PageFour';
import ITToolsPageNine from './PageNine';
import ITToolsPageOne from './PageOne';
import ITToolsPageSeven from './PageSeven';
import ITToolsPageSix from './PageSix';
import ITToolsPageThree from './PageThree';
import ITToolsPageTwo from './PageTwo';

type flatErrorsType = {
  [key: string]: string;
};

type enumType = {
  [key: string]: string;
  OTHER: string;
};

interface ITToolsFormComponentType {
  fieldName: string;
  subinfo?: string;
  needsTool: boolean;
  htmlID: string;
  EnumType: enumType;
  translation: (type: string) => string;
  subTranslation?: (type: string) => string;
  formikValue: string[];
  flatErrors: flatErrorsType;
}

export const ITToolsFormComponent = ({
  fieldName,
  subinfo,
  needsTool,
  htmlID,
  EnumType,
  translation,
  subTranslation,
  formikValue,
  flatErrors
}: ITToolsFormComponentType) => {
  return (
    <>
      <p className="margin-top-4">{i18next.t('itTools:tools')}</p>

      {subinfo && <p className="text-base">{subinfo}</p>}

      {Object.keys(EnumType)
        .sort(sortOtherEnum)
        .map(type => {
          return (
            <Fragment key={type}>
              <Field
                as={CheckboxField}
                disabled={!needsTool}
                id={`it-tools-${htmlID}-${type}`}
                testid={`it-tools-${htmlID}-${type}`}
                name={fieldName}
                label={translation(type)}
                subLabel={subTranslation ? subTranslation(type) : null}
                value={type}
                checked={formikValue.includes(type) && needsTool}
              />
              {type === EnumType.OTHER &&
                needsTool &&
                formikValue.includes(type) && (
                  <div className="margin-left-4 margin-top-1">
                    <Label
                      htmlFor={`it-tools-${htmlID}-other`}
                      className="text-normal"
                    >
                      {i18next.t('draftModelPlan:pleaseSpecify')}
                    </Label>
                    <FieldErrorMsg>
                      {flatErrors[`${fieldName}Other`]}
                    </FieldErrorMsg>
                    <Field
                      as={TextInput}
                      type="text"
                      className="maxw-none"
                      id={`it-tools-${htmlID}-other`}
                      data-testid={`it-tools-${htmlID}-other`}
                      maxLength={50}
                      name={`${fieldName}Other`}
                    />
                  </div>
                )}
            </Fragment>
          );
        })}
      <AddNote id={`it-tools-${htmlID}-note`} field={`${fieldName}Note`} />
    </>
  );
};

export const ITTools = () => {
  const { taskListSectionLocks } = useContext(SubscriptionContext);
  return (
    <MainContent data-testid="model-it-tools">
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Switch>
            <Redirect
              exact
              from="/models/:modelID/task-list/it-tools"
              to="/models/:modelID/task-list/it-tools/page-one"
            />
            <Route
              path="/models/:modelID/task-list/it-tools/page-one"
              exact
              render={() => (
                <ITToolsPageOne
                  characteristicsLock={findLockedSection(
                    taskListSectionLocks,
                    taskListSectionMap.characteristics
                  )}
                />
              )}
            />
            <Route
              path="/models/:modelID/task-list/it-tools/page-two"
              exact
              render={() => (
                <ITToolsPageTwo
                  participantsAndProvidersLock={findLockedSection(
                    taskListSectionLocks,
                    taskListSectionMap['participants-and-providers']
                  )}
                />
              )}
            />
            <Route
              path="/models/:modelID/task-list/it-tools/page-three"
              exact
              render={() => (
                <ITToolsPageThree
                  participantsAndProvidersLock={findLockedSection(
                    taskListSectionLocks,
                    taskListSectionMap['participants-and-providers']
                  )}
                />
              )}
            />
            <Route
              path="/models/:modelID/task-list/it-tools/page-four"
              exact
              render={() => (
                <ITToolsPageFour
                  opsEvalAndLearningLock={findLockedSection(
                    taskListSectionLocks,
                    taskListSectionMap['ops-eval-and-learning']
                  )}
                />
              )}
            />
            <Route
              path="/models/:modelID/task-list/it-tools/page-five"
              exact
              render={() => (
                <ITToolsPageFive
                  opsEvalAndLearningLock={findLockedSection(
                    taskListSectionLocks,
                    taskListSectionMap['ops-eval-and-learning']
                  )}
                />
              )}
            />
            <Route
              path="/models/:modelID/task-list/it-tools/page-six"
              exact
              render={() => (
                <ITToolsPageSix
                  opsEvalAndLearningLock={findLockedSection(
                    taskListSectionLocks,
                    taskListSectionMap['ops-eval-and-learning']
                  )}
                />
              )}
            />
            <Route
              path="/models/:modelID/task-list/it-tools/page-seven"
              exact
              render={() => (
                <ITToolsPageSeven
                  opsEvalAndLearningLock={findLockedSection(
                    taskListSectionLocks,
                    taskListSectionMap['ops-eval-and-learning']
                  )}
                />
              )}
            />
            <Route
              path="/models/:modelID/task-list/it-tools/page-eight"
              exact
              render={() => (
                <ITToolsPageEight
                  opsEvalAndLearningLock={findLockedSection(
                    taskListSectionLocks,
                    taskListSectionMap['ops-eval-and-learning']
                  )}
                  paymentsLock={findLockedSection(
                    taskListSectionLocks,
                    taskListSectionMap['ops-eval-and-learning']
                  )}
                />
              )}
            />
            <Route
              path="/models/:modelID/task-list/it-tools/page-nine"
              exact
              render={() => (
                <ITToolsPageNine
                  paymentsLock={findLockedSection(
                    taskListSectionLocks,
                    taskListSectionMap['ops-eval-and-learning']
                  )}
                />
              )}
            />
            <Route path="*" render={() => <NotFoundPartial />} />
          </Switch>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ITTools;
