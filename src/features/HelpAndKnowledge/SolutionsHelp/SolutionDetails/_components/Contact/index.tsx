import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Icon, Link } from '@trussworks/react-uswds';
import {
  SolutionContactType,
  solutionHelpRoute
} from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import UswdsReactLink from 'components/LinkWrapper';

import { formatQueryParam } from '../../Modal';

import './index.scss';

export const Contact = ({
  contact,
  closeRoute
}: {
  contact?: SolutionContactType;
  closeRoute?: string;
}) => {
  const { t } = useTranslation('helpAndKnowledge');
  const { t: h } = useTranslation('generalReadOnly');

  const location = useLocation();

  const paramValues = location.search.substring(1).split('&');
  const isOnPointsOfContact = paramValues.includes('section=points-of-contact');

  return (
    <div className="point-of-contact">
      <p className="font-body-xs margin-y-0">{t('primaryPointOfContact')}</p>

      <h3 className="system-profile__subheader margin-top-1 margin-bottom-05">
        {contact?.name}
      </h3>

      <Link
        aria-label={h('contactInfo.sendAnEmail')}
        className="line-height-body-5 display-flex flex-align-center margin-bottom-3"
        href={`mailto:${contact?.email}`}
        target="_blank"
      >
        <Icon.Mail
          className="margin-right-1 top-1px text-tbottom"
          aria-label="mail"
        />
        {h('contactInfo.sendAnEmail')}
      </Link>

      {!isOnPointsOfContact && (
        <UswdsReactLink
          to={formatQueryParam(
            paramValues,
            'points-of-contact',
            closeRoute || solutionHelpRoute
          )}
        >
          {t('moreContacts')}
          <Icon.ArrowForward
            className="margin-left-1"
            style={{ top: '2px' }}
            aria-label="forward"
          />
        </UswdsReactLink>
      )}
    </div>
  );
};

export default Contact;
