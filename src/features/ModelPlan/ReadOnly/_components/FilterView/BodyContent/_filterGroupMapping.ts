import { ModelViewFilter, MtoCommonSolutionKey } from 'gql/generated/graphql';

import { getKeys } from 'types/translation';

// Importing ModelViewFilter enum and converting to lowercase to work easily with FE routes
export const filterGroups = getKeys(ModelViewFilter).map(filter =>
  filter.toLowerCase()
);

export type FilterGroup = (typeof filterGroups)[number];

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
  MtoCommonSolutionKey[]
> = {
  cbosc: [MtoCommonSolutionKey.CBOSC],
  ccw: [MtoCommonSolutionKey.CCW, MtoCommonSolutionKey.SHARED_SYSTEMS],
  dfsdm: [MtoCommonSolutionKey.IPC],
  ipc: [
    MtoCommonSolutionKey.INNOVATION,
    MtoCommonSolutionKey.ACO_OS,
    MtoCommonSolutionKey.CDX,
    MtoCommonSolutionKey.IPC
  ],
  iddoc: [MtoCommonSolutionKey.INNOVATION, MtoCommonSolutionKey.ACO_OS],
  mdm: [MtoCommonSolutionKey.MDM_POR],
  pbg: [
    MtoCommonSolutionKey.IPC,
    MtoCommonSolutionKey.SHARED_SYSTEMS,
    MtoCommonSolutionKey.EFT
  ]
};
