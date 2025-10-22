import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardGroup,
  Grid,
  GridContainer,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { helpSolutionsArray } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import {
  ComponentGroup,
  MtoCommonSolutionKey,
  useGetHomepageSettingsQuery,
  useUpdateHomepageSettingsMutation,
  ViewCustomizationType
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageLoading from 'components/PageLoading';
import toastSuccess from 'components/ToastSuccess';
import { useErrorMessage } from 'contexts/ErrorContext';
import { tObject } from 'utils/translation';

import { HomepageSettingsLocationType } from '../Settings';

import '../index.scss';

/**
 * Moves an item in an array up or down by one position.
 *
 * @param {Array<ViewCustomizationType>} array - The array to modify.
 * @param {number} index - The index of the item to move.
 * @param {'up' | 'down'} direction - The direction to move the item ('up' or 'down').
 * @returns {Record<'viewCustomization', Array<ViewCustomizationType>>} A new array with the item moved, or the original array if the move is not possible.
 */

export const moveItem = (
  array: ViewCustomizationType[],
  index: number,
  direction: 'up' | 'down'
): Record<'viewCustomization', Array<ViewCustomizationType>> => {
  // Clone the array to avoid mutating the original array
  const newArray = [...array];

  // Calculate the new index based on the direction
  const newIndex = direction === 'up' ? index - 1 : index + 1;

  // Check if the new index is within the bounds of the array
  if (newIndex >= 0 && newIndex < array.length) {
    // Swap the elements
    [newArray[index], newArray[newIndex]] = [
      newArray[newIndex],
      newArray[index]
    ];
  }

  return { viewCustomization: newArray };
};

const SettingsOrder = () => {
  const { t: homepageSettingsT } = useTranslation('homepageSettings');
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const navigate = useNavigate();

  const { state } = useLocation();

  const { data, loading } = useGetHomepageSettingsQuery();

  const [mutate] = useUpdateHomepageSettingsMutation();

  const { setErrorMeta } = useErrorMessage();

  // State to manage order of selected settings, defaults to the current router state
  const [selectedSettings, setSelectedSettings] = useState<
    HomepageSettingsLocationType['homepageSettings'] | undefined
  >(state?.homepageSettings);

  // Sorts, and replaces any underscores within solution acronyms.  Returns an array of selected solutions acronyms or names
  const selectedSolutions = useMemo(() => {
    const possibleSolutions = data?.userViewCustomization.solutions || [];

    return [...helpSolutionsArray]
      .filter(solution =>
        possibleSolutions.includes(solution.key as MtoCommonSolutionKey)
      )
      .map(solution => solution.acronym || solution.name);
  }, [data?.userViewCustomization]);

  const componentGroupTrans = tObject<keyof ComponentGroup, any>(
    'homepageSettings:componentGroupAcronyms'
  );

  const selectedComponentGroups = useMemo(() => {
    return (data?.userViewCustomization.componentGroups || []).map(
      (componentGroup: ComponentGroup) =>
        componentGroupTrans[componentGroup as unknown as keyof ComponentGroup]
    );
  }, [data?.userViewCustomization, componentGroupTrans]);

  // Waits for data to be loaded, then sets the selected settings to the current state if no router state
  useEffect(() => {
    if (!loading && !selectedSettings) {
      setSelectedSettings({
        viewCustomization: data?.userViewCustomization.viewCustomization || []
      });
    }
  }, [data?.userViewCustomization, loading, selectedSettings]);

  const handleSubmit = () => {
    setErrorMeta({
      overrideMessage: homepageSettingsT('settingsError')
    });

    mutate({
      variables: {
        changes: {
          viewCustomization: selectedSettings?.viewCustomization || []
        }
      }
    }).then(response => {
      if (!response?.errors) {
        toastSuccess(homepageSettingsT('success'));
        // Removes router state upon successful mutation
        window.history.replaceState({}, '');
        navigate('/');
      }
    });
  };

  return (
    <MainContent>
      <GridContainer>
        <Grid desktop={{ col: 12 }} tablet={{ col: 12 }} mobile={{ col: 12 }}>
          <Breadcrumbs
            items={[
              BreadcrumbItemOptions.HOME,
              BreadcrumbItemOptions.HOME_SETTINGS
            ]}
          />

          <h1 className="margin-bottom-2">
            {homepageSettingsT('heading')}
            <span className="font-body-lg text-base text-normal margin-left-2">
              {homepageSettingsT('stepTwo')}
            </span>
          </h1>

          <p className="font-body-lg margin-top-0 margin-bottom-6">
            {homepageSettingsT('descriptionTwo')}
          </p>

          <h3>{homepageSettingsT('selectionTwo')}</h3>

          {selectedSettings?.viewCustomization.length === 0 && (
            <Alert type="info" slim className="margin-top-4">
              {homepageSettingsT('emptySettingsTwo')}
            </Alert>
          )}

          <Grid desktop={{ col: 6 }} tablet={{ col: 12 }} mobile={{ col: 12 }}>
            {loading && !selectedSettings && !data?.userViewCustomization ? (
              <div className="margin-top-8">
                <PageLoading />
              </div>
            ) : (
              <div>
                <CardGroup className="margin-0 margin-bottom-6">
                  {selectedSettings?.viewCustomization.map((setting, index) => (
                    <Grid
                      desktop={{ col: 12 }}
                      tablet={{ col: 12 }}
                      mobile={{ col: 12 }}
                      data-testid={`${setting}-${index}`}
                      key={setting}
                    >
                      <div
                        className="display-flex flex-align-center margin-bottom-2"
                        key={setting}
                      >
                        <h3 className="margin-0 margin-right-2 width-4">
                          {index + 1}
                        </h3>

                        <Card className="settings__card settings__card-order margin-bottom-0 width-full">
                          <div className="padding-0 display-flex flex-align-center flex-justify">
                            <div>
                              <p className="margin-0 padding-0 text-bold">
                                {homepageSettingsT(
                                  `settings.${setting}.heading`
                                )}
                              </p>

                              {/* If MODELS_BY_SOLUTION selected solutions, render solutions */}
                              {setting ===
                                ViewCustomizationType.MODELS_BY_SOLUTION && (
                                <p className="margin-0">
                                  {selectedSolutions.length > 0
                                    ? selectedSolutions.join(', ')
                                    : homepageSettingsT('noneSelected')}
                                </p>
                              )}

                              {setting ===
                                ViewCustomizationType.MODELS_BY_GROUP && (
                                <p className="margin-0">
                                  {selectedComponentGroups.length > 0
                                    ? selectedComponentGroups.join(', ')
                                    : homepageSettingsT('noneSelected')}
                                </p>
                              )}
                            </div>

                            <div className="display-flex flex-align-center">
                              <Button
                                type="button"
                                className="usa-button--unstyled"
                                aria-label={homepageSettingsT('orderUp')}
                                onClick={() =>
                                  setSelectedSettings(
                                    moveItem(
                                      selectedSettings.viewCustomization,
                                      index,
                                      'up'
                                    )
                                  )
                                }
                              >
                                <Icon.ArrowDropUp
                                  className={classNames(
                                    {
                                      settings__icon__disabled: index === 0
                                    },
                                    'settings__icon margin-right-1 pointer'
                                  )}
                                  data-testid={`move-${index}-up`}
                                  size={5}
                                  aria-label="up arrow"
                                />
                              </Button>

                              <Button
                                type="button"
                                className="usa-button--unstyled"
                                aria-label={homepageSettingsT('orderDown')}
                                onClick={() =>
                                  setSelectedSettings(
                                    moveItem(
                                      selectedSettings.viewCustomization,
                                      index,
                                      'down'
                                    )
                                  )
                                }
                              >
                                <Icon.ArrowDropDown
                                  className={classNames(
                                    {
                                      settings__icon__disabled:
                                        index ===
                                        selectedSettings.viewCustomization
                                          .length -
                                          1
                                    },
                                    'settings__icon pointer'
                                  )}
                                  data-testid={`move-${index}-down`}
                                  size={5}
                                  aria-label="down arrow"
                                />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </Grid>
                  ))}
                </CardGroup>
              </div>
            )}
          </Grid>

          <div className="display-flex">
            <Button
              type="button"
              outline
              className="margin-bottom-4"
              onClick={() =>
                navigate('/homepage-settings/form', {
                  state: { homepageSettings: selectedSettings }
                })
              }
            >
              {miscellaneousT('back')}
            </Button>

            <Button
              type="submit"
              className="margin-bottom-4"
              onClick={() => handleSubmit()}
              data-testid="save-settings-order"
            >
              {homepageSettingsT('submit')}
            </Button>
          </div>

          <div style={{ width: 'fit-content' }}>
            <UswdsReactLink to="/" className="display-flex flex-align-center">
              <Icon.ArrowBack className="margin-right-2" aria-label="back" />
              {homepageSettingsT('back')}
            </UswdsReactLink>
          </div>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default SettingsOrder;
