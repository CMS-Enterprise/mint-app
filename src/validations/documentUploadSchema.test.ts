import { DocumentUploadValidationSchema } from './documentUploadSchema';

describe('Document upload form schema validation', () => {
  const minimumRequiredForm = {
    file: {
      lastModified: '1643225188687',
      lastModifiedDate:
        'Wed Jan 26 2022 14:26:28 GMT-0500 (Eastern Standard Time)',
      name: 'abc.pdf',
      size: 3028,
      type: 'application/pdf',
      webkitRelativePath: ''
    },
    restricted: true,
    documentType: 'CONCEPT_PAPER',
    otherTypeDescription: ''
  };

  it('passes backend input validation', async () => {
    await expect(
      DocumentUploadValidationSchema.isValid(minimumRequiredForm)
    ).resolves.toBeTruthy();
  });

  it(`errors on an empty form`, async () => {
    await expect(
      DocumentUploadValidationSchema.isValid({})
    ).resolves.toBeFalsy();
  });
});
