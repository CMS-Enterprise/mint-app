import { ADMIN_DEV, ADMIN_PROD, BASIC_PROD } from 'constants/jobCodes';
import { Flags } from 'types/flags';

import { isAdmin, isBasicUser } from './user';

describe('user', () => {
  describe('isAdmin', () => {
    describe('groups', () => {
      const flags = {} as Flags;
      describe('dev job code exists in groups', () => {
        const groups = [ADMIN_DEV];

        it('returns true', () => {
          expect(isAdmin(groups, flags)).toBe(true);
        });
      });

      describe('prod job code exists in groups', () => {
        const groups = [ADMIN_PROD];

        it('returns true', () => {
          expect(isAdmin(groups, flags)).toBe(true);
        });
      });

      describe('no admin job code exists in groups', () => {
        const groups = [BASIC_PROD];

        it('returns false', () => {
          expect(isAdmin(groups, flags)).toBe(false);
        });
      });
    });
  });

  describe('isBasicUser', () => {
    const defaultFlags = {} as Flags;
    describe('prod user job code exists in groups', () => {
      const groups = [BASIC_PROD];
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
  });
});
