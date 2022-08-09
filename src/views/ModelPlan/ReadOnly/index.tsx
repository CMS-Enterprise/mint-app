import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, NavLink, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Grid,
  GridContainer,
  IconArrowBack,
  IconBookmark,
  IconExpandMore,
  Link,
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

import './index.scss';

const ReadOnly = () => {
  const { t } = useTranslation('modelSummary');
  const { t: h } = useTranslation('generalReadOnly');
  // const { modelID } = useParams<{ modelID: string }>();
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
            Medicare Diabetes Prevention Program - Expanded Model Revamped
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
              <DescriptionDefinition
                definition={t('descriptionFiller')}
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
              <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                <DescriptionDefinition
                  className="font-body-sm"
                  definition={t('summary.keyCharacteristics')}
                />
                <DescriptionTerm
                  className="font-body-lg line-height-sans-2 margin-0"
                  term="this is description terms"
                />
              </Grid>
              <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                <DescriptionDefinition
                  className="font-body-sm"
                  definition={t('summary.modelLeads')}
                />
                <DescriptionTerm
                  className="font-body-lg line-height-sans-2 margin-0"
                  term="this is description terms"
                />
              </Grid>
              {/* Go live date */}
              <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                <DescriptionDefinition
                  className="font-body-sm"
                  definition={t('summary.modelStartDate')}
                />
                <DescriptionTerm
                  className="font-body-lg line-height-sans-2 margin-0"
                  term="July 27, 2015"
                />
              </Grid>
              {/* Most recent major change */}
              <Grid desktop={{ col: 6 }} className="margin-bottom-2">
                <DescriptionDefinition
                  className="font-body-sm"
                  definition={t('summary.crAndTdls')}
                />
                <DescriptionTerm
                  className="font-body-lg line-height-sans-2 margin-0"
                  term="December 4, 2021"
                />
              </Grid>
            </Grid>
          </CollapsableLink>
        </GridContainer>
      </SummaryBox>
      {/* <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <h1>asdf</h1>
        </Grid>
      </GridContainer> */}
    </MainContent>
  );
};

export default ReadOnly;
