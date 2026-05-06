import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Grid, Icon, Link } from '@trussworks/react-uswds';
import { TeamRole, useGetModelCollaboratorsQuery } from 'gql/generated/graphql';

import { Avatar } from 'components/Avatar';
import CollapsableLink from 'components/CollapsableLink';
import PageNumber from 'components/PageNumber';
import Spinner from 'components/Spinner';
import { tArray } from 'utils/translation';

const AboutWaiverAssessmentSurvey = () => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();

  const expandItems = tArray(
    'waiverAssessmentSurveyMisc:aboutWaiverAssessmentSurvey.whyDoINeedToCompleteThisSurveyItems'
  );

  const { data, loading } = useGetModelCollaboratorsQuery({
    variables: {
      id: modelID
    }
  });

  const modelLeads = useMemo(
    () =>
      data?.modelPlan?.collaborators?.filter(collaborator =>
        collaborator.teamRoles.includes(TeamRole.MODEL_LEAD)
      ) || [],
    [data]
  );

  return (
    <div className="mint-body-normal">
      <h2 className="margin-bottom-2 margin-top-6">
        {waiverAssessmentSurveyMiscT('aboutWaiverAssessmentSurvey.heading')}
      </h2>

      <p className="margin-top-0">
        {waiverAssessmentSurveyMiscT('aboutWaiverAssessmentSurvey.description')}
      </p>

      <CollapsableLink
        id="complete-survey-why"
        horizontalCaret
        className="margin-bottom-3"
        childClassName="padding-top-0"
        label={waiverAssessmentSurveyMiscT(
          'aboutWaiverAssessmentSurvey.whyDoINeedToCompleteThisSurvey'
        )}
      >
        <span>
          {waiverAssessmentSurveyMiscT(
            'aboutWaiverAssessmentSurvey.yourResponsesWill'
          )}
        </span>
        <ul className="margin-0">
          {expandItems.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CollapsableLink>

      <h3 className="margin-top-0 margin-bottom-1">
        {waiverAssessmentSurveyMiscT(
          'aboutWaiverAssessmentSurvey.whosInvolved'
        )}
      </h3>

      <p className="margin-top-0 margin-bottom-1">
        {waiverAssessmentSurveyMiscT(
          'aboutWaiverAssessmentSurvey.whosInvolvedDescription'
        )}
      </p>

      <Link
        aria-label={waiverAssessmentSurveyMiscT(
          'aboutWaiverAssessmentSurvey.email'
        )}
        href="mailto:MINTTeam@cms.hhs.gov"
        target="_blank"
      >
        {waiverAssessmentSurveyMiscT('aboutWaiverAssessmentSurvey.email')}
        <Icon.MailOutline
          className="margin-left-1 text-tbottom"
          aria-label="mail"
        />
      </Link>

      <Grid row gap className="margin-y-3">
        <Grid desktop={{ col: 6 }} tablet={{ col: 6 }}>
          <h4 className="margin-top-0 margin-bottom-1">
            {waiverAssessmentSurveyMiscT(
              'aboutWaiverAssessmentSurvey.modelTeam'
            )}
          </h4>

          <p className="margin-top-0">
            {waiverAssessmentSurveyMiscT(
              'aboutWaiverAssessmentSurvey.modelTeamDescription'
            )}
          </p>
        </Grid>

        <Grid desktop={{ col: 6 }} tablet={{ col: 6 }}>
          <h4 className="margin-top-0 margin-bottom-1">
            {waiverAssessmentSurveyMiscT(
              'aboutWaiverAssessmentSurvey.modelLead'
            )}
          </h4>

          {loading && <Spinner />}

          {!loading &&
            modelLeads.map(collaborator => (
              <Avatar
                user={collaborator.userAccount.commonName}
                teamRoles={[TeamRole.MODEL_LEAD]}
                className="margin-y-2"
                key={collaborator.userAccount.id}
              />
            ))}
        </Grid>
      </Grid>

      <h3 className="margin-top-0 margin-bottom-1">
        {waiverAssessmentSurveyMiscT(
          'aboutWaiverAssessmentSurvey.whatHappenNext'
        )}
      </h3>

      <p className="margin-top-0 margin-bottom-6">
        {waiverAssessmentSurveyMiscT(
          'aboutWaiverAssessmentSurvey.whatHappenNextDescription'
        )}
      </p>

      <div className="margin-top-0 margin-bottom-3">
        <Button
          type="button"
          onClick={() =>
            navigate(
              `/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/model-plan-questions`
            )
          }
        >
          {miscellaneousT('next')}
        </Button>
      </div>

      <Button
        type="button"
        className="usa-button usa-button--unstyled"
        onClick={() =>
          navigate(
            `/models/${modelID}/collaboration-area/additional-questionnaires`
          )
        }
      >
        <Icon.ArrowBack
          className="margin-right-1"
          aria-hidden
          aria-label="back"
        />

        {miscellaneousT('returnToCollaborationArea')}
      </Button>

      <PageNumber currentPage={1} totalPages={7} className="margin-y-6" />
    </div>
  );
};

export default AboutWaiverAssessmentSurvey;
