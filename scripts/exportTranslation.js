import * as fs from 'fs';

import generalCharacteristics from '../src/i18n/en-US/modelPlan/generalCharacteristics';

// Function to parse TypeScript file
function parseTranslationFileToJSON() {
  const jsonString = JSON.stringify(
    JSON.parse(JSON.stringify(generalCharacteristics)),
    null,
    2
  );
  fs.writeFileSync('output.json', jsonString);
}

parseTranslationFileToJSON();
