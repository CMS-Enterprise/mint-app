import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader
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
        className: 'radius-lg shadow-2 minh-mobile padding-0 margin-0'
      }}
      className={classNames('desktop:grid-col-6', className)}
    >
      <div className="padding-x-3 padding-bottom-3 display-flex flex-column height-full">
        <CardHeader className="padding-0">
          <h3 className="line-height-body-4 margin-bottom-1 margin-top-3">
            {milestone.name}
          </h3>
        </CardHeader>

        <CardBody className="padding-x-0 padding-top-0">description</CardBody>

        <CardFooter className="padding-x-0 padding-top-2 padding-bottom-0">
          <Button type="button">Add to matrix</Button>

          <Button type="button" unstyled>
            About this milestone
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default MilestoneCard;
