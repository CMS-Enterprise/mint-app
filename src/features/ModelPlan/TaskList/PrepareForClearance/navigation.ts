export type PrepareForClearanceOrigin = 'tasks' | 'collaborationArea';

export type PrepareForClearanceLocationState = {
  prepareForClearanceOrigin?: PrepareForClearanceOrigin;
};

export const getPrepareForClearanceOrigin = (
  state: unknown
): PrepareForClearanceOrigin => {
  const origin = (state as PrepareForClearanceLocationState | null)
    ?.prepareForClearanceOrigin;
  if (origin === 'collaborationArea') {
    return 'collaborationArea';
  }
  return 'tasks';
};

export const getPrepareForClearancePath = (modelID: string): string =>
  `/models/${modelID}/collaboration-area/prepare-for-clearance`;

export const getPrepareForClearanceReturnPath = (
  modelID: string,
  origin: PrepareForClearanceOrigin
): string => {
  if (origin === 'collaborationArea') {
    return `/models/${modelID}/collaboration-area`;
  }
  return `/models/${modelID}/collaboration-area/tasks`;
};
