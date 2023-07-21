import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  GridContainer,
  IconArrowForward,
  SummaryBox
} from '@trussworks/react-uswds';

import HelpAndKnowledgeCategoryTag from 'components/HelpAndKnowledgeCategoryTag';
import HelpBreadcrumb from 'components/HelpBreadcrumb';
import UswdsReactLink, { LocationProps } from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

type LinkProps = {
  to: string | LocationProps;
  children: React.ReactNode | string;
};

const Link = ({ to, children }: LinkProps) => {
  return (
    <UswdsReactLink to="asdf" className="display-flex flex-align-center">
      {children}
      <IconArrowForward />
    </UswdsReactLink>
  );
};

const TwoPagerMeeting = () => {
  const { t: twoPageMeetingT } = useTranslation('twoPageMeeting');

  return (
    <MainContent>
      <GridContainer>
        <Grid>
          <HelpBreadcrumb text={twoPageMeetingT('title')} />
          <PageHeading className="margin-bottom-1">
            {twoPageMeetingT('title')}
          </PageHeading>
          <HelpAndKnowledgeCategoryTag
            type="gettingStarted"
            className="margin-bottom-1"
          />
          <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-4">
            {twoPageMeetingT('description')}
          </p>

          <SummaryBox
            heading={twoPageMeetingT('summaryBox.title')}
            className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2"
          >
            <ul className="margin-y-0">
              <li className="margin-bottom-1">
                <Link to="asdf">
                  {twoPageMeetingT('summaryBox.listItem.draft')}
                </Link>
              </li>
              <li className="margin-bottom-1">
                <Link to="asdf">
                  {twoPageMeetingT('summaryBox.listItem.start')}
                </Link>
              </li>
              <li className="margin-bottom-1">
                <Link to="asdf">
                  {twoPageMeetingT('summaryBox.listItem.review')}
                </Link>
              </li>
            </ul>
          </SummaryBox>

          <PageHeading className="margin-bottom-1" headingLevel="h2">
            {twoPageMeetingT('summaryBox.listItem.draft')}
          </PageHeading>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default TwoPagerMeeting;
