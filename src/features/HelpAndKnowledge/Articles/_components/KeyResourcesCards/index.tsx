import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardGroup, CardHeader } from '@trussworks/react-uswds';

import ExternalLink from 'components/ExternalLink';

const KeyResourcesCards = () => {
  const { t: sixPageMeetingT } = useTranslation('sixPageMeeting');

  return (
    <CardGroup>
      <Card
        data-testid="article-card"
        gridLayout={{ mobile: { col: 12 }, tablet: { col: 6 } }}
        containerProps={{
          className: 'radius-md shadow-2 padding-2'
        }}
      >
        <CardHeader className="padding-0">
          <h4 className="line-height-body-4 margin-bottom-05">
            {sixPageMeetingT('keyResources.cardOne.heading')}
          </h4>
        </CardHeader>

        <CardBody className="padding-0">
          <ExternalLink
            className="mint-body-normal"
            href={sixPageMeetingT('keyResources.cardOne.linkOne.link')}
          >
            {sixPageMeetingT('keyResources.cardOne.linkOne.text')}
          </ExternalLink>

          <ExternalLink
            className="mint-body-normal"
            href={sixPageMeetingT('keyResources.cardOne.linkTwo.link')}
          >
            {sixPageMeetingT('keyResources.cardOne.linkTwo.text')}
          </ExternalLink>
        </CardBody>
      </Card>

      <Card
        data-testid="article-card"
        gridLayout={{ mobile: { col: 12 }, tablet: { col: 6 } }}
        containerProps={{
          className: 'radius-md shadow-2 padding-2'
        }}
      >
        <CardHeader className="padding-0">
          <h4 className="line-height-body-4 margin-bottom-05">
            {sixPageMeetingT('keyResources.cardTwo.heading')}
          </h4>

          <p className="margin-y-0 text-base mint-body-normal">
            {sixPageMeetingT('keyResources.cardTwo.hint')}
          </p>
        </CardHeader>

        <CardBody className="padding-0">
          <ExternalLink
            className="mint-body-normal"
            href={sixPageMeetingT('keyResources.cardTwo.linkOne.link')}
          >
            {sixPageMeetingT('keyResources.cardTwo.linkOne.text')}
          </ExternalLink>
        </CardBody>
      </Card>
    </CardGroup>
  );
};

export default KeyResourcesCards;
