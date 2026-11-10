import { z } from 'zod';

/**
 * Licence templates we accept on a Wikimedia Commons file page. All mean the
 * work is in the public domain because its term has expired. Adding one is a
 * deliberate change: read docs/research/sources.md first.
 */
export const LICENCE_TEMPLATES = [
  'PD-old-70-expired',
  'PD-old-auto-expired',
] as const;

const COMMONS_FILE = 'https://commons.wikimedia.org/wiki/File:';

/** The Commons page of a file, as Commons itself writes the address. */
export function commonsFileUrl(file: string): string {
  return COMMONS_FILE + encodeURIComponent(file.replace(/ /g, '_'));
}

/** One card's image: where it came from and the licence check behind it. */
export const imageEntrySchema = z
  .object({
    cardId: z.string().min(1),
    /** File name on Commons, without the "File:" prefix. */
    file: z
      .string()
      .regex(
        /^[^:/]+\.(jpe?g|png)$/i,
        'a Commons file name, no "File:" prefix',
      ),
    /** Licence template found on the file page. */
    licence: z.enum(LICENCE_TEMPLATES),
    author: z.string().min(1),
    /** The file page that was checked. */
    sourceUrl: z.url(),
    /** Day the file page was read, YYYY-MM-DD. */
    checked: z.iso.date(),
    /** Who read the page. */
    checkedBy: z.enum(['script', 'person']),
  })
  .strict()
  .refine((e) => e.sourceUrl === commonsFileUrl(e.file), {
    message: 'sourceUrl must be the Commons page of `file`',
    path: ['sourceUrl'],
  });

/** Every bundled image of one deck, with its provenance. */
export const imageManifestSchema = z
  .object({
    deckId: z.string().min(1),
    /** Name of the scan set, for people. */
    set: z.string().min(1),
    /** Commons category the files were taken from. */
    categoryUrl: z
      .url()
      .startsWith('https://commons.wikimedia.org/wiki/Category:'),
    images: z.array(imageEntrySchema),
  })
  .strict()
  .superRefine((m, ctx) => {
    for (const key of ['cardId', 'file'] as const) {
      const seen = new Set<string>();
      m.images.forEach((image, i) => {
        if (seen.has(image[key]))
          ctx.addIssue({
            code: 'custom',
            message: `duplicate ${key}: ${image[key]}`,
            path: ['images', i, key],
          });
        seen.add(image[key]);
      });
    }
  });

export type ImageEntry = z.infer<typeof imageEntrySchema>;
export type ImageManifest = z.infer<typeof imageManifestSchema>;
