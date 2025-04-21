import { ModelShareSection } from 'gql/generated/graphql';
import i18next from 'i18next';

import { getKeys } from 'types/translation';

type ExportSectionOption = {
  value: ModelShareSection;
  label: string;
};

const exportSectionOptions: ExportSectionOption[] = getKeys(
  ModelShareSection
).map(key => ({
  value: ModelShareSection[key],
  label: i18next.t(
    `generalReadOnly:modal.exportSections.${ModelShareSection[key]}`
  )
}));

export default exportSectionOptions;
