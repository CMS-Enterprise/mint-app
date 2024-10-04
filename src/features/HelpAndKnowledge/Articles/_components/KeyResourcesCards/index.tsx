import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Grid
} from '@trussworks/react-uswds';

import ExternalLink from 'components/ExternalLink';

const KeyResourcesCards = () => {
  const { t: sixPageMeetingT } = useTranslation('sixPageMeeting');

  return (
    <Grid row gap>
      <CardGroup>
        <Grid
          tablet={{ col: 6 }}
          desktop={{ col: 6 }}
          className="display-flex flex-align-stretch"
        >
          <Card
            containerProps={{
              className: 'radius-md shadow-2 padding-2'
            }}
            data-testid="article-card"
          >
            <CardHeader className="padding-0">
              <h4 className="line-height-body-4 margin-bottom-1">
                {sixPageMeetingT('keyResources.cardOne.heading')}
              </h4>
            </CardHeader>

            <CardBody className="padding-0 line-height-sans-6">
              <ExternalLink
                href={sixPageMeetingT('keyResources.cardOne.linkOne.link')}
              >
                {sixPageMeetingT('keyResources.cardOne.linkOne.text')}
              </ExternalLink>

              <ExternalLink
                href={sixPageMeetingT('keyResources.cardOne.linkTwo.link')}
              >
                {sixPageMeetingT('keyResources.cardOne.linkTwo.text')}
              </ExternalLink>
            </CardBody>
          </Card>
        </Grid>

        <Grid
          tablet={{ col: 6 }}
          desktop={{ col: 6 }}
          className="display-flex flex-align-stretch"
        >
          <Card
            containerProps={{
              className: 'radius-md shadow-2 padding-2'
            }}
            className="width-full"
            data-testid="article-card"
          >
            <CardHeader className="padding-0">
              <h4 className="line-height-body-4 margin-bottom-1">
                {sixPageMeetingT('keyResources.cardTwo.heading')}
              </h4>

              <p className="margin-y-0 text-base">
                {sixPageMeetingT('keyResources.cardTwo.hint')}
              </p>
            </CardHeader>

            <CardBody className="padding-0 line-height-sans-6">
              <ExternalLink
                href={sixPageMeetingT('keyResources.cardTwo.linkOne.link')}
              >
                {sixPageMeetingT('keyResources.cardTwo.linkOne.text')}
              </ExternalLink>
            </CardBody>
          </Card>
        </Grid>
      </CardGroup>
    </Grid>
  );
};

export default KeyResourcesCards;
