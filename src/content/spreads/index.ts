import type { Spread } from '../../domain/types';

export const singleCard: Spread = {
  id: 'single',
  name: 'Single card',
  description: 'One card for a quick answer or the theme of the day.',
  positions: [
    {
      id: 'card',
      role: 'focus',
      label: 'The card',
      meaning: 'The core of the matter',
      x: 0,
      y: 0,
    },
  ],
};

export const threeCard: Spread = {
  id: 'three-card',
  name: 'Past / Present / Future',
  description: 'A simple timeline reading.',
  positions: [
    { id: 'past', label: 'Past', meaning: 'What led here', x: 0, y: 0 },
    {
      id: 'present',
      role: 'focus',
      label: 'Present',
      meaning: 'The current situation',
      x: 1,
      y: 0,
    },
    {
      id: 'future',
      role: 'outcome',
      label: 'Future',
      meaning: 'Where it is heading',
      x: 2,
      y: 0,
    },
  ],
};

export const celticCross: Spread = {
  id: 'celtic-cross',
  name: 'Celtic Cross',
  description: 'The classic ten-card spread.',
  positions: [
    {
      id: 'present',
      role: 'focus',
      label: 'Present',
      meaning: 'The heart of the matter',
      x: 1,
      y: 1,
    },
    {
      id: 'challenge',
      role: 'obstacle',
      label: 'Challenge',
      meaning: 'What crosses you',
      x: 1,
      y: 1,
      rotated: true,
    },
    {
      id: 'foundation',
      label: 'Foundation',
      meaning: 'The root or basis',
      x: 1,
      y: 2,
    },
    {
      id: 'recent-past',
      label: 'Recent past',
      meaning: 'What is passing away',
      x: 0,
      y: 1,
    },
    {
      id: 'crown',
      label: 'Crown',
      meaning: 'Conscious aim or best outcome',
      x: 1,
      y: 0,
    },
    {
      id: 'near-future',
      label: 'Near future',
      meaning: 'What comes next',
      x: 2,
      y: 1,
    },
    {
      id: 'self',
      label: 'Self',
      meaning: 'Your stance in the matter',
      x: 3,
      y: 3,
    },
    {
      id: 'environment',
      label: 'Environment',
      meaning: 'Influences around you',
      x: 3,
      y: 2,
    },
    {
      id: 'hopes-fears',
      label: 'Hopes and fears',
      meaning: 'What you wish for or dread',
      x: 3,
      y: 1,
    },
    {
      id: 'outcome',
      role: 'outcome',
      label: 'Outcome',
      meaning: 'Where the path leads',
      x: 3,
      y: 0,
    },
  ],
};

export const spreads: readonly Spread[] = [singleCard, threeCard, celticCross];
export const getSpread = (id: string) => spreads.find((s) => s.id === id);
