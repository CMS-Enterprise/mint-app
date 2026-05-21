import {
  GetLockedModelPlanSectionsQuery,
  LockableSection
} from 'gql/generated/graphql';

export type LockSectionType =
  GetLockedModelPlanSectionsQuery['lockableSectionLocks'][0];

/**
 * Sections that are locked together. Used both to acquire/release locks on
 * navigation and to determine whether a section is blocked by another user's lock.
 */
const LINKED_SECTIONS: Partial<Record<LockableSection, LockableSection[]>> = {
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

/** Returns all sections linked with the given section (including itself). */
export const getLinkedSections = (
  section: LockableSection
): LockableSection[] => {
  return LINKED_SECTIONS[section] ?? [section];
};

/** Finds the first lock (direct or linked) that applies to the given section. */
export const findEffectiveLock = (
  locks: LockSectionType[] = [],
  section: LockableSection
): LockSectionType | undefined => {
  const linkedSections = getLinkedSections(section);

  return locks.find(lock => linkedSections.includes(lock.section));
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
