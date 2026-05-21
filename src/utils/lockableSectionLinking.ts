import {
  GetLockedModelPlanSectionsQuery,
  LockableSection
} from 'gql/generated/graphql';

export type LockSectionType =
  GetLockedModelPlanSectionsQuery['lockableSectionLocks'][0];

/**
 * Sections acquired/released on navigation.
 */
const SECTIONS_TO_LOCK: Partial<Record<LockableSection, LockableSection[]>> = {
  [LockableSection.WAIVER_ASSESSMENT_SURVEY]: [
    LockableSection.WAIVER_ASSESSMENT_SURVEY,
    LockableSection.BASICS,
    LockableSection.GENERAL_CHARACTERISTICS
  ],
  [LockableSection.BASICS]: [
    LockableSection.BASICS,
    LockableSection.WAIVER_ASSESSMENT_SURVEY
  ],
  [LockableSection.GENERAL_CHARACTERISTICS]: [
    LockableSection.GENERAL_CHARACTERISTICS,
    LockableSection.WAIVER_ASSESSMENT_SURVEY
  ]
};

/** Default sections blocked by a lock when held in isolation. */
const SECTIONS_BLOCKED_BY_LOCK: Partial<
  Record<LockableSection, LockableSection[]>
> = {
  [LockableSection.BASICS]: [
    LockableSection.BASICS,
    LockableSection.WAIVER_ASSESSMENT_SURVEY
  ],
  [LockableSection.GENERAL_CHARACTERISTICS]: [
    LockableSection.GENERAL_CHARACTERISTICS,
    LockableSection.WAIVER_ASSESSMENT_SURVEY
  ]
};

/** Returns sections to acquire or release when entering/leaving a section. */
export const getLinkedSections = (
  section: LockableSection
): LockableSection[] => {
  return SECTIONS_TO_LOCK[section] ?? [section];
};

/**
 * Returns sections blocked by a held lock. Waiver survey blocking extends to
 * basics and/or characteristics only when the same user also holds those locks.
 */
export const getSectionsBlockedByLock = (
  heldSection: LockableSection,
  sectionsHeldBySameUser: LockableSection[] = []
): LockableSection[] => {
  if (heldSection === LockableSection.WAIVER_ASSESSMENT_SURVEY) {
    const blocked: LockableSection[] = [
      LockableSection.WAIVER_ASSESSMENT_SURVEY
    ];

    if (sectionsHeldBySameUser.includes(LockableSection.BASICS)) {
      blocked.push(LockableSection.BASICS);
    }

    if (
      sectionsHeldBySameUser.includes(LockableSection.GENERAL_CHARACTERISTICS)
    ) {
      blocked.push(LockableSection.GENERAL_CHARACTERISTICS);
    }

    return blocked;
  }

  return SECTIONS_BLOCKED_BY_LOCK[heldSection] ?? [heldSection];
};

const getSectionsHeldByUser = (
  locks: LockSectionType[],
  username: string
): LockableSection[] => {
  return locks
    .filter(lock => lock.lockedByUserAccount.username === username)
    .map(lock => lock.section);
};

/** Finds the first lock (direct or linked) that applies to the given section. */
export const findEffectiveLock = (
  locks: LockSectionType[] = [],
  section: LockableSection
): LockSectionType | undefined => {
  return locks.find(lock => {
    const sectionsHeld = getSectionsHeldByUser(
      locks,
      lock.lockedByUserAccount.username
    );

    return getSectionsBlockedByLock(lock.section, sectionsHeld).includes(
      section
    );
  });
};

export enum LockStatus {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  OCCUPYING = 'OCCUPYING',
  CANT_LOCK = 'CANT_LOCK'
}

/**
 * Determines lock status for a section, including linked sections.
 * Returns LOCKED if another user holds a blocking lock, OCCUPYING if the current
 * user holds the direct section lock, or UNLOCKED otherwise.
 */
export const findLockedSection = (
  locks: LockSectionType[],
  section: LockableSection,
  userEUA?: string
): LockStatus => {
  const directLock = locks.find(lock => lock.section === section);
  const blockingLock = findEffectiveLock(locks, section);

  if (blockingLock && blockingLock.lockedByUserAccount.username !== userEUA) {
    return LockStatus.LOCKED;
  }

  if (directLock && directLock.lockedByUserAccount.username === userEUA) {
    return LockStatus.OCCUPYING;
  }

  return LockStatus.UNLOCKED;
};

/** Returns true when another user holds a lock that blocks the given section. */
export const isSectionLockedByOtherUser = (
  locks: LockSectionType[] = [],
  section: LockableSection,
  userEUA?: string
): boolean => {
  return findLockedSection(locks, section, userEUA) === LockStatus.LOCKED;
};
