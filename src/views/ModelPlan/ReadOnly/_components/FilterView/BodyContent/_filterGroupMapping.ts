import { ModelViewFilter, OperationalSolutionKey } from 'gql/gen/graphql';

import { getKeys } from 'types/translation';

// Importing ModelViewFilter enum and converting to lowercase to work easily with FE routes
export const filterGroups = getKeys(ModelViewFilter).map(filter =>
  filter.toLowerCase()
);

export type FilterGroup = typeof filterGroups[number];

// Map for url route params to ModelViewFilter enum
export const filterGroupKey: Record<FilterGroup, ModelViewFilter> = {
  cbosc: ModelViewFilter.CBOSC,
  ccw: ModelViewFilter.CCW,
  cmmi: ModelViewFilter.CMMI,
  dfsdm: ModelViewFilter.DFSDM,
  iddoc: ModelViewFilter.IDDOC,
  ipc: ModelViewFilter.IPC,
  mdm: ModelViewFilter.MDM,
  oact: ModelViewFilter.OACT,
  pbg: ModelViewFilter.PBG
};

// Map of operational solutions that should be rendered on each filter view
export const filteredGroupSolutions: Record<
  FilterGroup,
  OperationalSolutionKey[]
> = {
  cbosc: [OperationalSolutionKey.CBOSC],
  ccw: [OperationalSolutionKey.CCW, OperationalSolutionKey.SHARED_SYSTEMS],
  dfsdm: [OperationalSolutionKey.IPC],
  ipc: [
    OperationalSolutionKey.INNOVATION,
    OperationalSolutionKey.ACO_OS,
    OperationalSolutionKey.CDX,
    OperationalSolutionKey.IPC
  ],
  iddoc: [OperationalSolutionKey.INNOVATION, OperationalSolutionKey.ACO_OS],
  mdm: [OperationalSolutionKey.MDM],
  pbg: [
    OperationalSolutionKey.IPC,
    OperationalSolutionKey.SHARED_SYSTEMS,
    OperationalSolutionKey.EFT,
    OperationalSolutionKey.CONTRACTOR
  ]
};
