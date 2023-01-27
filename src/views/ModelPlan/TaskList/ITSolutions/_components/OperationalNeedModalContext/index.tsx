// Context Provider for Navigation Header
// Some sibling components other than header need to call/trigger state changes of the side mobile navigation

import React, { createContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import {
  UpdateCustomOperationalNeedById as MutationType,
  UpdateCustomOperationalNeedByIdVariables
} from 'queries/ITSolutions/types/UpdateCustomOperationalNeedById';
import UpdateCustomOperationalNeedById from 'queries/ITSolutions/UpdateCustomOperationalNeedById';

const OperationalNeedModalContext = createContext({
  isModalOpen: false,
  setIsModalOpen: (isModalOpen: boolean) => {}
});

// The context provider will be a wrapper that any child components can call to toggle side nav
type childrenProps = {
  children: React.ReactNode;
};

const OperationalNeedModalContextProvider = ({ children }: childrenProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removeNeed] = useMutation<
    MutationType,
    UpdateCustomOperationalNeedByIdVariables
  >(UpdateCustomOperationalNeedById);

  // const handleRemove = () = {
  //   removeNeed({
  //     variables: {
  //       id: id,
  //       customNeedType
  //     }
  //   })
  // }

  const consoleLogMe = () => {
    return console.log(operationalNeedToRemove);
  };

  return (
    // the Provider gives access to the context to its children
    <>
      <OperationalNeedModalContext.Provider
        value={{
          isModalOpen,
          setIsModalOpen
        }}
      >
        {children}
      </OperationalNeedModalContext.Provider>
      <Modal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)}>
        <PageHeading headingLevel="h2" className="margin-y-0">
          hello world
        </PageHeading>
        <p className="margin-top-2 margin-bottom-3">Lorem ipsum dolor sit.</p>
        <Button
          type="button"
          className="margin-right-4 bg-error"
          onClick={() => consoleLogMe()}
        >
          Confirm
        </Button>
        <Button type="button" unstyled onClick={() => setIsModalOpen(false)}>
          cancel
        </Button>
      </Modal>
    </>
  );
};

export { OperationalNeedModalContext, OperationalNeedModalContextProvider };

// To have the remove operational need mutation here
