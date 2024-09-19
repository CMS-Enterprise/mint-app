import '../src/config/i18n';
import '../src/app/index.scss';
import 'regenerator-runtime/runtime';
import { MockedProvider } from '@apollo/client/testing'; // Use for Apollo Version 3+

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  apolloClient: {
    MockedProvider,
    // any props you want to pass to MockedProvider on every story
  },
}
