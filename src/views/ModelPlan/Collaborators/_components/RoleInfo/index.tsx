import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import classNames from 'classnames';

import CollapsableLink from 'components/shared/CollapsableLink';

type RoleInfoProps = {
  className?: string;
};

const RoleInfo = ({ className }: RoleInfoProps) => {
  const { t: collaboratorsMiscT } = useTranslation('collaboratorsMisc');

  const roleInfoConfig = collaboratorsMiscT('rolesInfo', {
    returnObjects: true
  });

  return (
    <CollapsableLink
      id="available-role-info"
      className={classNames('width-full margin-y-4', className)}
      label={collaboratorsMiscT('rolesInfo.label')}
    >
      <ul className="margin-y-0 padding-left-4">
        {roleInfoConfig.baseRoles.map((role: string, index: number) => (
          <li className="line-height-body-6">
            <Trans
              i18nKey={`collaboratorsMisc:rolesInfo.baseRoles.${index}`}
              components={{
                bold: <strong />
              }}
            />
          </li>
        ))}
      </ul>

      <h5 className="margin-top-2 margin-bottom-1 padding-left-05">
        {collaboratorsMiscT('rolesInfo.workstreamLeads')}
      </h5>

      <p className="text-base margin-0 padding-left-05 line-height-body-4">
        {collaboratorsMiscT('rolesInfo.workstreamLeadsInfo')}
      </p>

      <ul className="margin-y-2 padding-left-4">
        {roleInfoConfig.workstreamRoles.map((role: string, index: number) => (
          <li className="line-height-body-6">
            <Trans
              i18nKey={`collaboratorsMisc:rolesInfo.workstreamRoles.${index}`}
              components={{
                bold: <strong />
              }}
            />
          </li>
        ))}
      </ul>

      <h5 className="margin-top-2 margin-bottom-1 padding-left-05">
        {collaboratorsMiscT('rolesInfo.otherRolesLabel')}
      </h5>

      <p className="text-base margin-0 padding-left-05 line-height-body-4">
        {collaboratorsMiscT('rolesInfo.otherRolesInfo')}
      </p>

      <ul className="margin-y-2 padding-left-4">
        {roleInfoConfig.otherRoles.map((role: string, index: number) => (
          <li className="line-height-body-6">
            <Trans
              i18nKey={`collaboratorsMisc:rolesInfo.otherRoles.${index}`}
              components={{
                bold: <strong />
              }}
            />
          </li>
        ))}
      </ul>
    </CollapsableLink>
  );
};

export default RoleInfo;
