import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';

import { CommonWaiverData } from '../..';

import './index.scss';

const WaiverCard = ({ waiver }: { waiver: CommonWaiverData }) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  const { t: waiverLibraryMiscT } = useTranslation('waiverLibraryMisc');

  const [, setSearchParams] = useSearchParams();

  const handleLearnAbout = () => {
    setSearchParams(prev => {
      const nextParams = new URLSearchParams(prev);
      nextParams.set('waiverId', waiver.id);
      return nextParams;
    });
  };

  return (
    <Card
      className="waiver-card margin-bottom-2"
      containerProps={{
        className: 'radius-md margin-0 padding-0 display-flex flex-column'
      }}
      style={{ height: '260px' }}
    >
      <CardHeader>
        {waiverAssessmentSurveyMiscT(`${waiver.waiverType}.shortName`)}

        <h3 className="line-height-normal margin-top-05">{waiver.name}</h3>
      </CardHeader>

      <CardBody className="waiver-card__body padding-y-0 flex-1 overflow-hidden">
        <p>{waiver.description}</p>
      </CardBody>

      <CardFooter className="padding-3 display-flex flex-align-center">
        <Button
          type="button"
          className="deep-underline mint-body-normal"
          unstyled
          onClick={handleLearnAbout}
        >
          {waiverLibraryMiscT('learnAbout')}
        </Button>

        <Icon.ArrowForward className="margin-left-1" aria-label="forward" />
      </CardFooter>
    </Card>
  );
};

export default WaiverCard;
