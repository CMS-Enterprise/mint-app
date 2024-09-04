import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import DocumentsCard from './index';

const modelID = 'ce3405a0-3399-4e3a-88d7-3cfc613d2905';

describe('Model Collaboration Area -- Documents Card', () => {
  it('renders empty state', () => {
    render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/collaboration-area/documents`]}
      >
        <DocumentsCard modelID={modelID} documents={[]} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: /documents/i
      })
    ).toBeInTheDocument();
    expect(screen.getByText('No documents added')).toBeInTheDocument();
    expect(screen.queryByText('View all')).not.toBeInTheDocument();
  });

  it('renders only "one link added" state', () => {
    render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/collaboration-area/documents`]}
      >
        <DocumentsCard
          modelID={modelID}
          documents={[
            {
              __typename: 'PlanDocument',
              id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
              fileName: 'My MINT document',
              fileType: 'externalLink'
            }
          ]}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: /documents/i
      })
    ).toBeInTheDocument();
    expect(screen.getByText('1 link added')).toBeInTheDocument();
    expect(screen.queryByText('1 uploaded')).not.toBeInTheDocument();
    expect(screen.queryByText('View all')).toBeInTheDocument();
  });

  it('renders only "one uploaded" state', () => {
    render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/collaboration-area/documents`]}
      >
        <DocumentsCard
          modelID={modelID}
          documents={[
            {
              __typename: 'PlanDocument',
              id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
              fileName: 'My MINT document',
              fileType: 'pdf'
            }
          ]}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: /documents/i
      })
    ).toBeInTheDocument();
    expect(screen.queryByText('1 link added')).not.toBeInTheDocument();
    expect(screen.queryByText('1 uploaded')).toBeInTheDocument();
    expect(screen.queryByText('View all')).toBeInTheDocument();
  });

  it('renders both types of document state', () => {
    render(
      <MemoryRouter
        initialEntries={[`/models/${modelID}/collaboration-area/documents`]}
      >
        <DocumentsCard
          modelID={modelID}
          documents={[
            {
              __typename: 'PlanDocument',
              id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
              fileName: 'My MINT document',
              fileType: 'externalLink'
            },
            {
              __typename: 'PlanDocument',
              id: 'ce3405a0-3399-4e3a-88d7-3cfc613d2905',
              fileName: 'My MINT document',
              fileType: 'pdf'
            }
          ]}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: /documents/i
      })
    ).toBeInTheDocument();
    expect(screen.getByText('1 link added')).toBeInTheDocument();
    expect(screen.getByText('1 uploaded')).toBeInTheDocument();
    expect(screen.queryByText('View all')).toBeInTheDocument();
  });
});
