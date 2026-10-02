import {
  LockableSection,
  LockableSectionLockStatus
} from 'gql/generated/graphql';

import {
  findEffectiveLock,
  findLockedSection,
  getLinkedSections,
  LockStatus
} from './lockableSectionLinking';

const otherUserLock = (
  section: LockableSection
): LockableSectionLockStatus => ({
  __typename: 'LockableSectionLockStatus',
  modelPlanID: '123',
  section,
  lockedByUserAccount: {
    id: '00000001-0001-0001-0001-000000000001',
    username: 'OTHER',
    commonName: 'Other User',
    email: 'other@oddball.io',
    familyName: 'User',
    givenName: 'Other',
    locale: 'en',
    zoneInfo: 'America/New_York',
    __typename: 'UserAccount'
  },
  isAssessment: false
});

const currentUserLock = (
  section: LockableSection
): LockableSectionLockStatus => ({
  ...otherUserLock(section),
  lockedByUserAccount: {
    ...otherUserLock(section).lockedByUserAccount,
    username: 'ME',
    commonName: 'Me'
  }
});

describe('lockableSectionLinking', () => {
  it('returns linked sections for waiver assessment survey', () => {
    expect(getLinkedSections(LockableSection.WAIVER_ASSESSMENT_SURVEY)).toEqual(
      [
        LockableSection.WAIVER_ASSESSMENT_SURVEY,
        LockableSection.BASICS,
        LockableSection.GENERAL_CHARACTERISTICS
      ]
    );
  });

  it('acquires basics and waiver assessment survey on the basics form', () => {
    expect(getLinkedSections(LockableSection.BASICS)).toEqual([
      LockableSection.BASICS,
      LockableSection.WAIVER_ASSESSMENT_SURVEY
    ]);
  });

  it('acquires general characteristics and waiver assessment survey on that form', () => {
    expect(getLinkedSections(LockableSection.GENERAL_CHARACTERISTICS)).toEqual([
      LockableSection.GENERAL_CHARACTERISTICS,
      LockableSection.WAIVER_ASSESSMENT_SURVEY
    ]);
  });

  it('treats basics as locked when another user holds all waiver-related locks', () => {
    const locks = [
      otherUserLock(LockableSection.WAIVER_ASSESSMENT_SURVEY),
      otherUserLock(LockableSection.BASICS),
      otherUserLock(LockableSection.GENERAL_CHARACTERISTICS)
    ];

    expect(findLockedSection(locks, LockableSection.BASICS, 'ME')).toEqual(
      LockStatus.LOCKED
    );
    expect(findEffectiveLock(locks, LockableSection.BASICS)?.section).toBe(
      LockableSection.WAIVER_ASSESSMENT_SURVEY
    );
  });

  it('treats waiver assessment survey as locked when basics is locked by another user', () => {
    const locks = [otherUserLock(LockableSection.BASICS)];

    expect(
      findLockedSection(locks, LockableSection.WAIVER_ASSESSMENT_SURVEY, 'ME')
    ).toEqual(LockStatus.LOCKED);
  });

  it('does not block general characteristics when only basics is locked', () => {
    const locks = [otherUserLock(LockableSection.BASICS)];

    expect(
      findLockedSection(locks, LockableSection.GENERAL_CHARACTERISTICS, 'ME')
    ).toEqual(LockStatus.UNLOCKED);
  });

  it('does not block general characteristics when another user holds basics and waiver locks', () => {
    const locks = [
      otherUserLock(LockableSection.BASICS),
      otherUserLock(LockableSection.WAIVER_ASSESSMENT_SURVEY)
    ];

    expect(
      findLockedSection(locks, LockableSection.GENERAL_CHARACTERISTICS, 'ME')
    ).toEqual(LockStatus.UNLOCKED);
  });

  it('treats general characteristics as locked when another user holds all waiver-related locks', () => {
    const locks = [
      otherUserLock(LockableSection.WAIVER_ASSESSMENT_SURVEY),
      otherUserLock(LockableSection.BASICS),
      otherUserLock(LockableSection.GENERAL_CHARACTERISTICS)
    ];

    expect(
      findLockedSection(locks, LockableSection.GENERAL_CHARACTERISTICS, 'ME')
    ).toEqual(LockStatus.LOCKED);
  });

  it('returns occupying when the current user holds the direct section lock', () => {
    const locks = [
      currentUserLock(LockableSection.BASICS),
      currentUserLock(LockableSection.WAIVER_ASSESSMENT_SURVEY)
    ];

    expect(findLockedSection(locks, LockableSection.BASICS, 'ME')).toEqual(
      LockStatus.OCCUPYING
    );
  });
});
