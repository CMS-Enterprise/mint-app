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
  SummaryBox
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import CollapsableLink from 'components/shared/CollapsableLink';
import {
  DescriptionDefinition,
  DescriptionTerm
} from 'components/shared/DescriptionGroup';
import SectionWrapper from 'components/shared/SectionWrapper';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
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

import SideNav from './_components/Sidenav';

import './index.scss';

const ReadOnly = () => {
  const { t } = useTranslation('modelSummary');
  const { t: h } = useTranslation('generalReadOnly');
  const isMobile = useCheckResponsiveScreen('tablet');
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

  const {
    modelName,
    modifiedDts,
    status,
    basics,
    generalCharacteristics,
    collaborators
  } = data?.modelPlan || ({} as GetModelSummaryTypes);

  const formattedApplicationStartDate =
    basics?.applicationsStart && formatDate(basics?.applicationsStart);

  const formattedKeyCharacteristics = generalCharacteristics?.keyCharacteristics.map(
    (item, index) => {
      return `${translateKeyCharacteristics(item)}${
        index === generalCharacteristics?.keyCharacteristics.length - 1
          ? ''
          : ', '
      }`;
    }
  );

  const formattedModelLeads = collaborators?.map((collaborator, index) => {
    return `${collaborator.fullName}${
      index === collaborators.length - 1 ? '' : ', '
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
        data-testid="read-only-model-summary"
      >
        <GridContainer>
          <UswdsReactLink
            to="/models"
            className="display-flex flex-align-center margin-bottom-3"
          >
            <IconArrowBack className="text-primary margin-right-1" />
            {h('back')}
          </UswdsReactLink>

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
            id={`${modelName?.replace(/\s+/g, '-').toLowerCase()}--description`}
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
              <DescriptionDefinition
                definition={basics?.goal ?? ''}
                ref={descriptionRef}
                dataTestId="read-only-model-summary__description"
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
                  term={
                    generalCharacteristics?.keyCharacteristics.length !== 0
                      ? formattedKeyCharacteristics
                      : t('noAnswer.noneEntered')
                  }
                />
              </Grid>
              <Grid col={6} className="margin-bottom-2">
                <DescriptionDefinition
                  className="font-body-sm"
                  definition={t('summary.modelLeads')}
                />
                <DescriptionTerm
                  className="font-body-lg line-height-sans-2 margin-bottom-0"
                  term={formattedModelLeads}
                />
              </Grid>
              <Grid col={6} className="margin-bottom-2 desktop:margin-bottom-0">
                <DescriptionDefinition
                  className="font-body-sm"
                  definition={t('summary.modelStartDate')}
                />
                <DescriptionTerm
                  className="font-body-lg line-height-sans-2 margin-bottom-0"
                  term={formattedApplicationStartDate ?? t('noAnswer.tBD')}
                />
              </Grid>
              <Grid col={6} className="margin-bottom-2 desktop:margin-bottom-0">
                <DescriptionDefinition
                  className="font-body-sm"
                  definition={t('summary.crAndTdls')}
                />
                <DescriptionTerm
                  className="font-body-lg line-height-sans-2 margin-bottom-0"
                  term={t('noAnswer.noneEntered')}
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
              readOnly
              modelID={modelID}
              status={status}
              updateLabel={h('updateStatus')}
              modifiedDts={modifiedDts ?? ''}
            />
          </div>
        </GridContainer>
      </SectionWrapper>
      <SectionWrapper className="model-plan-alert-wrapper">
        {status !== ModelStatus.CLEARED && status !== ModelStatus.ANNOUNCED && (
          <Alert type="warning" className="margin-bottom-5 desktop:margin-y-3">
            {h('alert')}
          </Alert>
        )}
      </SectionWrapper>
      <SectionWrapper className="model-plan__body-content">
        <GridContainer>
          <Grid row gap>
            {!isMobile && (
              <Grid desktop={{ col: 3 }} className="padding-right-4 sticky-nav">
                <SideNav modelID={modelID} />
              </Grid>
            )}

            <Grid desktop={{ col: 9 }}>
              <div>
                {/* <div id={subComponent.componentId ?? ''}> */}
                <GridContainer className="padding-left-0 padding-right-0">
                  <Grid row gap>
                    {/* Central component */}
                    <Grid desktop={{ col: 8 }}>Main Content</Grid>

                    {/* Contact info sidebar */}
                    <Grid
                      desktop={{ col: 4 }}
                      className={classnames({
                        'sticky-nav': !isMobile
                      })}
                    >
                      {/* Setting a ref here to reference the grid width for the fixed side nav */}
                      <div className="side-divider">
                        <div className="top-divider" />
                        {/* <PointsOfContactSidebar
                        subpageKey={subpageKey}
                        system={systemProfileData}
                        systemId={systemId}
                      /> */}
                        contact info
                      </div>
                    </Grid>
                  </Grid>
                </GridContainer>
              </div>
            </Grid>
          </Grid>
        </GridContainer>
      </SectionWrapper>
    </MainContent>
  );
};

export default ReadOnly;
