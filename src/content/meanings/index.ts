import type { MeaningTable } from '../../domain/types';
import { cupsMeanings } from './cups';
import { majorMeanings } from './major';
import { pentaclesMeanings } from './pentacles';
import { swordsMeanings } from './swords';
import { wandsMeanings } from './wands';

export const meanings: MeaningTable = {
  ...majorMeanings,
  ...wandsMeanings,
  ...cupsMeanings,
  ...swordsMeanings,
  ...pentaclesMeanings,
};
