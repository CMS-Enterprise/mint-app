import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardGroup, CardHeader } from '@trussworks/react-uswds';

import ExternalLink from 'components/ExternalLink';

type articleKey = 'twoPageMeeting' | 'sixPageMeeting';

const KeyResourcesCards = ({ articleKey }: { articleKey: articleKey }) => {
  const { t: twoPageMeetingT } = useTranslation('twoPageMeeting');
  const { t: sixPageMeetingT } = useTranslation('sixPageMeeting');

  const translationT =
    articleKey === 'twoPageMeeting' ? twoPageMeetingT : sixPageMeetingT;

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
            {translationT('keyResources.cardOne.heading')}
          </h4>
        </CardHeader>

        <CardBody className="padding-0">
          <ExternalLink
            className="mint-body-normal"
            href={translationT('keyResources.cardOne.linkOne.link')}
          >
            {translationT('keyResources.cardOne.linkOne.text')}
          </ExternalLink>

          <ExternalLink
            className="mint-body-normal"
            href={translationT('keyResources.cardOne.linkTwo.link')}
          >
            {translationT('keyResources.cardOne.linkTwo.text')}
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
            {translationT('keyResources.cardTwo.heading')}
          </h4>

          <p className="margin-y-0 text-base mint-body-normal">
            {translationT('keyResources.cardTwo.hint')}
          </p>
        </CardHeader>

        <CardBody className="padding-0">
          <ExternalLink
            className="mint-body-normal"
            href={translationT('keyResources.cardTwo.linkOne.link')}
          >
            {translationT('keyResources.cardTwo.linkOne.text')}
          </ExternalLink>
        </CardBody>
      </Card>
    </CardGroup>
  );
};

export default KeyResourcesCards;
