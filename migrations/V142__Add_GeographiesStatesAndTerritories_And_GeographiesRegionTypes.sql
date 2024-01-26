-- Create the StatesAndTerritories type
CREATE TYPE STATES_AND_TERRITORIES AS ENUM (
   'AL',
   'AK',
   'AZ',
   'AR',
   'CA',
   'CO',
   'CT',
   'DE',
   'DC',
   'FL',
   'GA',
   'HI',
   'ID',
   'IL',
   'IN',
   'IA',
   'KS',
   'KY',
   'LA',
   'ME',
   'MD',
   'MA',
   'MI',
   'MN',
   'MS',
   'MO',
   'MT',
   'NE',
   'NV',
   'NH',
   'NJ',
   'NM',
   'NY',
   'NC',
   'ND',
   'OH',
   'OK',
   'OR',
   'PA',
   'RI',
   'SC',
   'SD',
   'TN',
   'TX',
   'UT',
   'VT',
   'VA',
   'WA',
   'WV',
   'WI',
   'WY',
   'AS',
   'GU',
   'MP',
   'PR',
   'UM',
   'VI'
);

-- Create a new column in the plan_general_characteristics table to hold array of states or territories of the plan
ALTER TABLE plan_general_characteristics
  ADD COLUMN geographies_states_and_territories STATES_AND_TERRITORIES[];

-- Create the GEOGRAPHIES_REGION_TYPE type
CREATE TYPE GEOGRAPHIES_REGION_TYPE AS ENUM (
  'CBSA',
  'HRR',
  'MSA'
);

-- Create a new column in the plan_general_characteristics table to hold the array of region types of the plan
ALTER TABLE plan_general_characteristics
  ADD COLUMN geographies_region_types GEOGRAPHIES_REGION_TYPE[];
