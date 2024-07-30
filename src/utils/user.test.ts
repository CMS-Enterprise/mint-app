import { ASSESSMENT, BASIC } from 'constants/jobCodes';
import { Flags } from 'types/flags';

import { isAssessment, isBasicUser } from './user';

describe('user', () => {
  describe('isAssessment', () => {
    const defaultFlags = {} as Flags;
    describe('only user job code exists in groups', () => {
      const groups = [BASIC];
      it('returns false', () => {
        expect(isAssessment(groups, defaultFlags)).toBe(false);
      });
    });

    describe('only assessment job code', () => {
      const groups = [ASSESSMENT];
      it('returns true', () => {
        expect(isAssessment(groups, defaultFlags)).toBe(true);
      });
    });

    describe('both job codes', () => {
      const groups = [BASIC, ASSESSMENT];
      it('returns true', () => {
        expect(isAssessment(groups, defaultFlags)).toBe(true);
      });
    });

    describe('no job code exists in groups', () => {
      const groups: Array<String> = [];
      it('returns false', () => {
        expect(isAssessment(groups, defaultFlags)).toBe(false);
      });
    });

    describe('launchdarkly downgrade', () => {
      const groups = [BASIC, ASSESSMENT];
      it('returns true', () => {
        expect(
          isAssessment(groups, {
            downgradeAssessmentTeam: true,
            hideITLeadExperience: false,
            hideGroupView: true,
            helpScoutEnabled: false,
            feedbackEnabled: false,
            notificationsEnabled: false,
            changeHistoryEnabled: false,
            changeHistoryReleaseDate: ''
          })
        ).toBe(false);
      });
    });
  });

  describe('isBasicUser', () => {
    describe('only user job code exists in groups', () => {
      const groups = [BASIC];
      it('returns true', () => {
        expect(isBasicUser(groups)).toBe(true);
      });
    });

    describe('only assessment job code', () => {
      const groups = [ASSESSMENT];
      it('returns false', () => {
        expect(isBasicUser(groups)).toBe(false);
      });
    });

    describe('both job codes', () => {
      const groups = [BASIC, ASSESSMENT];
      it('returns true', () => {
        expect(isBasicUser(groups)).toBe(true);
      });
    });

    describe('no job code exists in groups', () => {
      const groups: Array<String> = [];
      it('returns false', () => {
        expect(isBasicUser(groups)).toBe(false);
      });
    });
  });
});
