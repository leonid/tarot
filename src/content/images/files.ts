/**
 * How the optimised card images are stored. Shared by the script that writes
 * them (scripts/optimise-images.mjs) and the test that checks them.
 */

/** Pixel widths written for every card. 240 covers a board card at 2x. */
export const IMAGE_WIDTHS = [240, 480] as const;
export type ImageWidth = (typeof IMAGE_WIDTHS)[number];

/** Width to height of every file; the mean shape of the scans. */
export const IMAGE_ASPECT = 0.577;

/** Upper limit for all optimised files of one deck together. */
export const IMAGE_BUDGET_BYTES = 8 * 1024 * 1024;

/** Folder under `public/` for a manifest's files. */
export const IMAGE_DIR = 'cards/rws-1909';

export const imageHeight = (width: ImageWidth): number =>
  Math.round(width / IMAGE_ASPECT);

/** Path of a card's file, relative to the site root. */
export const imageFile = (cardId: string, width: ImageWidth): string =>
  `${IMAGE_DIR}/${cardId}-${width}.webp`;
