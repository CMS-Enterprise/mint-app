import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  Grid,
  GridContainer,
  IconArrowBack,
  IconExpandMore,
  Link,
  SummaryBox
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import CollapsableLink from 'components/shared/CollapsableLink';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import SectionWrapper from 'components/shared/SectionWrapper';
import GetModelSummary from 'queries/ReadOnly/GetModelSummary';
import {
  GetModelSummary as GetModelSummaryType,
  GetModelSummary_modelPlan as GetModelSummaryTypes
} from 'queries/ReadOnly/types/GetModelSummary';
import { ModelStatus } from 'types/graphql-global-types';
import { formatDate } from 'utils/date';
import { translateKeyCharacteristics } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import TaskListStatus from '../TaskList/_components/TaskListStatus';

import './index.scss';

const ReadOnly = () => {
  const { t } = useTranslation('modelSummary');
  const { t: h } = useTranslation('generalReadOnly');
  const { modelID } = useParams<{ modelID: string }>();

  const descriptionRef = React.createRef<HTMLElement>();
  const [
    isDescriptionExpandable,
    setIsDescriptionExpandable
  ] = useState<boolean>(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState<boolean>(
    false
  );

  // Enable the description toggle if it overflows
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const { current: el } = descriptionRef;
    if (!el) return;
    if (el.scrollHeight > el.offsetHeight) {
      setIsDescriptionExpandable(true);
    }
  });

  const { data, loading, error } = useQuery<GetModelSummaryType>(
    GetModelSummary,
    {
      variables: {
        id: modelID
      }
    }
  );

  const { modelName, basics, generalCharacteristics, collaborators } =
    data?.modelPlan || ({} as GetModelSummaryTypes);

  const formattedApplicationStartDate =
    basics?.applicationsStart && formatDate(basics?.applicationsStart);

  const characteristics = generalCharacteristics?.keyCharacteristics;
  const formattedKeyCharacteristics = characteristics.map((item, index) => {
    return `${translateKeyCharacteristics(item)}${
      index === characteristics.length - 1 ? '' : ', '
    }`;
  });

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  return (
    <MainContent
      className="model-plan-read-only"
      data-testid="model-plan-read-only"
    >
      <SummaryBox
        heading=""
        className="padding-y-6 border-0 bg-primary-lighter"
      >
        <GridContainer>
          <Link
            href="/"
            className="display-flex flex-align-center margin-bottom-3"
          >
            <IconArrowBack className="text-primary margin-right-1" />
            {h('back')}
          </Link>

          <PageHeading className="margin-0 line-height-sans-2">
            {modelName}
          </PageHeading>

          <CollapsableLink
            className="margin-top-3 padding-0"
            eyeIcon
            startOpen
            labelPosition="bottom"
            closeLabel={h('hideSummary')}
            styleLeftBar={false}
            id={t('singleSystem.id')}
            label={h('showSummary')}
          >
            <div
              className={classnames(
                'description-truncated',
                'margin-bottom-2',
                {
                  expanded: descriptionExpanded
                }
              )}
            >
              {/* * TODO:
                1. Create a new query for READ ONLY
                2. Pull in data

                  - Key Characteristics should be populated by the info from /characteristics/key-characteristics - keyCharacteristics

                  - Should include warning on model plan changes beneath summary - Warning message should show for every Model Plan status except for "Cleared" and "Announced"

                  End TODO:
              */}
              <DescriptionDefinition
                definition={basics?.goal ?? ''}
                ref={descriptionRef}
                className="font-body-lg line-height-body-5 text-light"
              />
              {isDescriptionExpandable && (
                <div>
                  <Button
                    unstyled
                    type="button"
                    className="margin-top-1"
                    onClick={() => {
                      setDescriptionExpanded(!descriptionExpanded);
                    }}
                  >
                    {h(
                      descriptionExpanded
                        ? 'description.less'
                        : 'description.more'
                    )}
                    <IconExpandMore className="expand-icon margin-left-05 margin-bottom-2px text-tbottom" />
                  </Button>
                </div>
              )}
            </div>
            <Grid row className="margin-top-3">
              <Grid col={6} className="margin-bottom-2">
                <DescriptionDefinition
                  className="font-body-sm"
                  definition={t('summary.keyCharacteristics')}
                />
                <DescriptionTerm
                  className="font-body-lg line-height-sans-2 margin-bottom-0"
                  term={formattedKeyCharacteristics ?? ''}
                />
              </Grid>
              <Grid col={6} className="margin-bottom-2">
                <DescriptionDefinition
                  className="font-body-sm"
                  definition={t('summary.modelLeads')}
                />
                <DescriptionTerm
                  className="font-body-lg line-height-sans-2 margin-bottom-0"
                  term="COLLABORERS GOES HERE"
                />
              </Grid>
              <Grid col={6} className="margin-bottom-2 desktop:margin-bottom-0">
                <DescriptionDefinition
                  className="font-body-sm"
                  definition={t('summary.modelStartDate')}
                />
                <DescriptionTerm
                  className="font-body-lg line-height-sans-2 margin-bottom-0"
                  term={formattedApplicationStartDate ?? ''}
                />
              </Grid>
              <Grid col={6} className="margin-bottom-2 desktop:margin-bottom-0">
                <DescriptionDefinition
                  className="font-body-sm"
                  definition={t('summary.crAndTdls')}
                />
                <DescriptionTerm
                  className="font-body-lg line-height-sans-2 margin-bottom-0"
                  term=""
                />
              </Grid>
            </Grid>
          </CollapsableLink>
        </GridContainer>
      </SummaryBox>
      <SectionWrapper className="model-plan-status-bar bg-base-lightest">
        <GridContainer>
          <div className="padding-y-1">
            <TaskListStatus
              icon
              modelID="823dffdc-e71e-48c2-bb2b-bb60a38b79b3"
              status={ModelStatus.PLAN_DRAFT}
              updateLabel={h('updateStatus')}
              // modifiedDts={modifiedDts}
              modifiedDts="2022-08-10T18:26:13.200336Z"
            />
          </div>
        </GridContainer>
      </SectionWrapper>
      <SectionWrapper className="model-plan-alert-wrapper">
        <Alert type="warning" className="margin-bottom-5 desktop:margin-y-3">
          {h('alert')}
        </Alert>
      </SectionWrapper>
    </MainContent>
  );
};

export default ReadOnly;
