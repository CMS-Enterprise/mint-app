import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { IconArrowForward, IconLaunch, Link } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import { SolutionContactType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import { formatQueryParam } from '../../Modal';

import './index.scss';

export const Contact = ({ contact }: { contact: SolutionContactType }) => {
  const { t } = useTranslation('helpAndKnowledge');
  const { t: h } = useTranslation('generalReadOnly');

  const location = useLocation();

  const paramValues = location.search.substring(1).split('&');
  const isOnPointsOfContact = paramValues.includes('section=points-of-contact');

  return (
    <div className="point-of-contact margin-top-6">
      <p className="font-body-xs margin-top-0 margin-bottom-3">
        {t('contact')}
      </p>

      <h3
        className={`system-profile__subheader margin-top-0 ${
          contact.role ? 'margin-bottom-05' : 'margin-bottom-1'
        }`}
      >
        {contact.name}
      </h3>

      {contact.role && (
        <p className="margin-top-0 margin-bottom-1">{contact.role}</p>
      )}

      <Link
        aria-label={h('contactInfo.sendAnEmail')}
        className="line-height-body-5 display-flex flex-align-center margin-bottom-3"
        href={`mailto:${contact.email}`}
        target="_blank"
      >
        {h('contactInfo.sendAnEmail')}

        <IconLaunch className="margin-left-05 margin-bottom-2px text-tbottom" />
      </Link>

      {!isOnPointsOfContact && (
        <UswdsReactLink
          to={formatQueryParam(paramValues, 'points-of-contact')}
          className="display-flex flex-align-center"
        >
          {t('moreContacts')}
          <IconArrowForward className="margin-left-1" />
        </UswdsReactLink>
      )}
    </div>
  );
};

export default Contact;
