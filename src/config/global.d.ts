import { Flags } from '../types/flags';

declare module '@okta/okta-signin-widget';
declare module '@okta/okta-signin-widget/dist/js/okta-sign-in.min';
declare module 'launchdarkly-js-sdk-common' {
  export interface LDFlagSet extends Flags {}
}

declare module 'json2csv'

declare global {
  // Here, declare things that go in the global namespace, or augment
  // existing declarations in the global namespace

  declare module '*.doc';
  declare module '*.pdf';
  declare module '*.docx';
  declare module '*.xlsx';

  // These types are defined in GQL generated types.
  // Defining globally here for FE to recognize generated types.
  //
  // Until we add better scalar mapping with graphql-codegen, anything added here should
  // also be added to codegen.ts
  type UUID = string;
  type Time = string;
  type Upload = File;
  type HTML = string;
  type TaggedHTML = HTML;
  type Any = any;

  interface Window {
    Cypress: any;
    Beacon: any;
    store: any;
  }
}
