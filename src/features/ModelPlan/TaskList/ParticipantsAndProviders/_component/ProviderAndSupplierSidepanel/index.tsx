import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Grid,
  GridContainer,
  Select,
  SideNav as TrussSideNav
} from '@trussworks/react-uswds';

import Sidepanel from 'components/Sidepanel';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import {
  ExistingProviderSupplierTypes,
  existingProviderSupplierTypesNames
} from 'i18n/en-US/modelPlan/participantsAndProviders';
import { getKeys } from 'types/translation';
import { tObject } from 'utils/translation';

import ProviderAndSupplierTable from '../ProviderAndSupplierTable';

import './index.scss';

type ProviderAndSupplierSidepanelProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const ProviderAndSupplierSidepanel = ({
  isOpen,
  closeModal
}: ProviderAndSupplierSidepanelProps) => {
  const { t: modalT } = useTranslation('participantsAndProvidersMisc');
  const isMobile = useCheckResponsiveScreen('tablet', 'smaller');

  const [activeType, setActiveType] = useState<ExistingProviderSupplierTypes>(
    ExistingProviderSupplierTypes.PROVIDER_TYPES_INSTITUTIONAL
  );

  const providerAndSupplierTypes = tObject<
    ExistingProviderSupplierTypes,
    string
  >('participantsAndProvidersMisc:modal.existingProviderSupplierTypesNames');

  const sidenavItems = getKeys(providerAndSupplierTypes).map(
    (key: ExistingProviderSupplierTypes) => {
      const value = providerAndSupplierTypes[key];
      return (
        <Button
          key={key}
          type="button"
          unstyled
          className={`sidenav-button line-height-sans-3 width-full ${
            activeType === key ? 'current' : ''
          }`}
          onClick={() => setActiveType(key)}
        >
          {value}
        </Button>
      );
    }
  );

  const renderModal = () => {
    return (
      <Sidepanel
        ariaLabel="Close Modal"
        closeModal={closeModal}
        isOpen={isOpen}
        modalHeading={modalT('modal.title')}
        testid="provider-supplier-modal"
      >
        <div className="bg-primary-darker text-white padding-x-4 padding-top-5 padding-bottom-6">
          <div>
            <h1 className="margin-0 margin-top-05 line-height-body-2">
              {modalT('modal.title')}
            </h1>
            <h4 className="margin-0 text-primary-lighter">
              {modalT('modal.asOfDate')}
            </h4>
          </div>
        </div>

        <GridContainer className="padding-y-6 margin-left-0">
          <Grid row gap>
            {isMobile && (
              <Grid desktop={{ col: 12 }} className="margin-bottom-4">
                <Select
                  id="provider-supplier-modal--select"
                  name="provider-supplier-modal--select"
                  value={activeType}
                  onChange={e =>
                    setActiveType(
                      e.currentTarget.value as ExistingProviderSupplierTypes
                    )
                  }
                >
                  {getKeys(providerAndSupplierTypes).map(key => (
                    <option key={key} value={key}>
                      {providerAndSupplierTypes[key]}
                    </option>
                  ))}
                </Select>
              </Grid>
            )}
            {!isMobile && (
              <Grid desktop={{ col: 3 }}>
                <div id="provider-supplier-modal--sidenav">
                  <TrussSideNav items={sidenavItems} />
                </div>
              </Grid>
            )}

            <Grid desktop={{ col: 8 }}>
              <h2 className="margin-top-0">
                {existingProviderSupplierTypesNames[activeType]}
              </h2>
              <ProviderAndSupplierTable type={activeType} />
            </Grid>
          </Grid>
        </GridContainer>
      </Sidepanel>
    );
  };

  return <>{renderModal()}</>;
};

export default ProviderAndSupplierSidepanel;
