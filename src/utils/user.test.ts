import {
  ACCESSIBILITY_ADMIN_DEV,
  ACCESSIBILITY_ADMIN_PROD,
  ACCESSIBILITY_TESTER_DEV,
  ACCESSIBILITY_TESTER_PROD,
  BASIC_USER_PROD,
  GOVTEAM_DEV,
  GOVTEAM_PROD
} from 'constants/jobCodes';
import { Flags } from 'types/flags';

import {
  isAccessibilityAdmin,
  isAccessibilityTeam,
  isAccessibilityTester,
  isBasicUser,
  isGrtReviewer
} from './user';

describe('user', () => {
  describe('isGrtReviewer', () => {
    describe('groups', () => {
      const flags = {} as Flags;
      describe('dev job code exists in groups', () => {
        const groups = [GOVTEAM_DEV];

        it('returns true', () => {
          expect(isGrtReviewer(groups, flags)).toBe(true);
        });
      });

      describe('prod job code exists in groups', () => {
        const groups = [GOVTEAM_PROD];

        it('returns true', () => {
          expect(isGrtReviewer(groups, flags)).toBe(true);
        });
      });

      describe('no grt job code exists in groups', () => {
        const groups = [BASIC_USER_PROD];

        it('returns false', () => {
          expect(isGrtReviewer(groups, flags)).toBe(false);
        });
      });
    });

    describe('flags', () => {
      const groups = [GOVTEAM_DEV];

      describe('the downgrade flag is false', () => {
        const flags = { downgradeGovTeam: false } as Flags;
        it('returns true', () => {
          expect(isGrtReviewer(groups, flags)).toBe(true);
        });
      });

      describe('the downgrade flag is true', () => {
        const flags = { downgradeGovTeam: true } as Flags;
        it('returns false', () => {
          expect(isGrtReviewer(groups, flags)).toBe(false);
        });
      });
    });
  });

  describe('isAccessibilityTester', () => {
    describe('groups', () => {
      const flags = {} as Flags;
      describe('dev job code exists in groups', () => {
        const groups = [ACCESSIBILITY_TESTER_DEV];

        it('returns true', () => {
          expect(isAccessibilityTester(groups, flags)).toBe(true);
        });
      });

      describe('prod job code exists in groups', () => {
        const groups = [ACCESSIBILITY_TESTER_PROD];

        it('returns true', () => {
          expect(isAccessibilityTester(groups, flags)).toBe(true);
        });
      });

      describe('no grt job code exists in groups', () => {
        const groups = [BASIC_USER_PROD];

        it('returns false', () => {
          expect(isAccessibilityTester(groups, flags)).toBe(false);
        });
      });
    });

    describe('flags', () => {
      const groups = [ACCESSIBILITY_TESTER_DEV];

      describe('the downgrade flag is false', () => {
        const flags = { downgrade508Tester: false } as Flags;
        it('returns true', () => {
          expect(isAccessibilityTester(groups, flags)).toBe(true);
        });
      });

      describe('the downgrade flag is true', () => {
        const flags = { downgrade508Tester: true } as Flags;
        it('returns false', () => {
          expect(isAccessibilityTester(groups, flags)).toBe(false);
        });
      });
    });
  });

  describe('isAccessibilityAdmin', () => {
    describe('groups', () => {
      const flags = {} as Flags;
      describe('dev job code exists in groups', () => {
        const groups = [ACCESSIBILITY_ADMIN_DEV];

        it('returns true', () => {
          expect(isAccessibilityAdmin(groups, flags)).toBe(true);
        });
      });

      describe('prod job code exists in groups', () => {
        const groups = [ACCESSIBILITY_ADMIN_PROD];

        it('returns true', () => {
          expect(isAccessibilityAdmin(groups, flags)).toBe(true);
        });
      });

      describe('no grt job code exists in groups', () => {
        const groups = [BASIC_USER_PROD];

        it('returns false', () => {
          expect(isAccessibilityAdmin(groups, flags)).toBe(false);
        });
      });
    });

    describe('flags', () => {
      const groups = [ACCESSIBILITY_ADMIN_DEV];

      describe('the downgrade flag is false', () => {
        const flags = { downgrade508User: false } as Flags;
        it('returns true', () => {
          expect(isAccessibilityAdmin(groups, flags)).toBe(true);
        });
      });

      describe('the downgrade flag is true', () => {
        const flags = { downgrade508User: true } as Flags;
        it('returns false', () => {
          expect(isAccessibilityAdmin(groups, flags)).toBe(false);
        });
      });
    });
  });

  describe('isAccessibilityTeam', () => {
    const flags = {} as Flags;

    describe('user has the accessibility tester code', () => {
      const groups = [ACCESSIBILITY_TESTER_PROD, BASIC_USER_PROD];

      it('returns true', () => {
        expect(isAccessibilityTeam(groups, flags)).toBe(true);
      });
    });

    describe('user has the accessibility admin code', () => {
      const groups = [ACCESSIBILITY_ADMIN_PROD, BASIC_USER_PROD];

      it('returns true', () => {
        expect(isAccessibilityTeam(groups, flags)).toBe(true);
      });
    });

    describe('user has neither accessibility code', () => {
      const groups = [BASIC_USER_PROD];

      it('returns false', () => {
        expect(isAccessibilityTeam(groups, flags)).toBe(false);
      });
    });
  });

  describe('isBasicUser', () => {
    const defaultFlags = {} as Flags;
    describe('prod user job code exists in groups', () => {
      const groups = [BASIC_USER_PROD];
      it('returns true', () => {
        expect(isBasicUser(groups, defaultFlags)).toBe(true);
      });
    });

    describe('no job code exists in groups', () => {
      const groups: Array<String> = [];
      it('returns true', () => {
        expect(isBasicUser(groups, defaultFlags)).toBe(true);
      });
    });

    describe('other job codes exist in groups', () => {
      const groups = [ACCESSIBILITY_ADMIN_DEV];
      it('returns false', () => {
        expect(isBasicUser(groups, defaultFlags)).toBe(false);
      });
    });

    describe('other job codes exist in groups, but they have been downgraded with flags', () => {
      it('returns true if 508 admin is downgraded', () => {
        const flags = { downgrade508User: true } as Flags;
        const groups = [ACCESSIBILITY_ADMIN_DEV];
        expect(isBasicUser(groups, flags)).toBe(true);
      });

      it('returns true if 508 tester is downgraded', () => {
        const flags = { downgrade508Tester: true } as Flags;
        const groups = [ACCESSIBILITY_TESTER_DEV];
        expect(isBasicUser(groups, flags)).toBe(true);
      });

      it('returns true if GRT admin is downgraded', () => {
        const flags = { downgradeGovTeam: true } as Flags;
        const groups = [GOVTEAM_DEV];
        expect(isBasicUser(groups, flags)).toBe(true);
      });

      it('returns true if everything is downgraded', () => {
        const flags = {
          downgradeGovTeam: true,
          downgrade508User: true,
          downgrade508Tester: true
        } as Flags;
        const groups = [
          ACCESSIBILITY_ADMIN_DEV,
          ACCESSIBILITY_TESTER_DEV,
          GOVTEAM_DEV
        ];
        expect(isBasicUser(groups, flags)).toBe(true);
      });
    });
  });
});
