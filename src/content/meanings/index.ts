import type { MeaningTable } from '../../domain/types';
import { majorMeanings } from './major';
import { minorMeanings } from './minor';

export const meanings: MeaningTable = { ...majorMeanings, ...minorMeanings };
