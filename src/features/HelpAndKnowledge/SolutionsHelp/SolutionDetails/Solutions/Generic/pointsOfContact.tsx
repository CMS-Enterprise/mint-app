import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon,
  Link
} from '@trussworks/react-uswds';
import {
  HelpSolutionType,
  SolutionContactType,
  SystemOwnerType
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Divider from 'components/Divider';

const PointOfContactCard = ({
  pointOfContact
}: {
  pointOfContact: SolutionContactType;
}) => {
  return (
    <Card
      className="margin-bottom-0"
      containerProps={{
        className: 'radius-md padding-2 margin-bottom-2 margin-x-0'
      }}
    >
      <CardHeader className="padding-0">
        <h3 className="margin-0">{pointOfContact.name}</h3>
      </CardHeader>
      <CardBody className="padding-0 margin-bottom-1 display-flex flex-align-center">
        <Link
          aria-label={pointOfContact.email}
          className="margin-0 line-height-body-5"
          href={`mailto:${pointOfContact.email}`}
          target="_blank"
        >
          {pointOfContact.email}
          <Icon.MailOutline className="margin-left-05 margin-bottom-2px text-tbottom" />
        </Link>
      </CardBody>
      {pointOfContact.role && (
        <CardFooter className="padding-0 font-body-xs">
          {pointOfContact.role}
        </CardFooter>
      )}
    </Card>
  );
};

const GenericCard = ({ contact }: { contact: SystemOwnerType }) => {
  return (
    <Card
      key={contact.system}
      className="margin-bottom-0"
      containerProps={{
        className: 'radius-md padding-2 margin-bottom-2 margin-x-0'
      }}
    >
      <CardHeader className="font-body-xs padding-0">
        {contact.system}
      </CardHeader>
      {contact.name && (
        <CardFooter className="padding-0">
          <h3 className="margin-0 line-height-sans-2">{contact.name}</h3>
        </CardFooter>
      )}
    </Card>
  );
};

export const GenericPointsOfContact = ({
  solution
}: {
  solution: HelpSolutionType;
}) => {
  const { t } = useTranslation('helpAndKnowledge');

  const pointsOfContactSorted = [...(solution?.pointsOfContact || [])].sort(
    (a, b) => a.name.localeCompare(b.name)
  );

  return (
    <div>
      {/* Sort to have primary first in array */}
      {[
        ...(pointsOfContactSorted.filter(x => x.isPrimary) || []),
        ...(pointsOfContactSorted.filter(x => !x.isPrimary) || [])
      ].map(contact => (
        <PointOfContactCard pointOfContact={contact} key={contact.name} />
      ))}

      {solution.systemOwner && (
        <>
          <Divider className="margin-y-6" />

          <h2>{t('systemOwner')}</h2>

          <GenericCard contact={solution.systemOwner} />
        </>
      )}

      {solution.contractors?.length && (
        <>
          <Divider className="margin-y-6" />

          <h2>{t('contractors')}</h2>

          {solution.contractors.map(contact => (
            <GenericCard contact={contact} key={contact.name} />
          ))}
        </>
      )}
    </div>
  );
};

export default GenericPointsOfContact;
