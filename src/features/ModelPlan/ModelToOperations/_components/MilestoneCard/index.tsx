import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import { MilestoneCardType } from '../../MilestoneLibrary';

import '../../index.scss';

const MilestoneCard = ({
  className,
  milestone
}: {
  className?: string;
  milestone: MilestoneCardType;
}) => {
  const { t } = useTranslation('modelToOperationsMisc');

  const { modelID } = useParams<{ modelID: string }>();

  return (
    <Card
      containerProps={{
        className: 'radius-md minh-mobile padding-0 margin-0'
      }}
      className={classNames(className, 'margin-bottom-2')}
    >
      {/* <div className="padding-x-3 padding-bottom-3 display-flex flex-column height-full"> */}
      <CardHeader className="padding-3 padding-bottom-0">
        <div className="display-flex flex-justify">
          <span className="text-base">Milestone</span>
          <span className="bg-primary-lighter padding-right-1 text-primary">
            <Icon.LightbulbOutline className="margin-left-1" /> Suggested
          </span>
        </div>
        <h3 className="line-height-normal margin-top-1">{milestone.name}</h3>
      </CardHeader>

      <CardBody className="padding-x-3">description</CardBody>

      <CardFooter className="padding-3">
        <Button type="button" className="margin-right-2">
          Add to matrix
        </Button>

        <Button type="button" unstyled>
          About this milestone
        </Button>
      </CardFooter>
      {/* </div> */}
    </Card>
  );
};

export default MilestoneCard;
