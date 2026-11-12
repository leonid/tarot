import { useEffect } from 'react';
import { useI18n } from './i18n';
import { PageHead } from './kit';

export const ABOUT_SECTIONS = ['sources', 'privacy', 'licence'] as const;

/**
 * What the app is, what it is not, where its pictures and texts come from,
 * what happens to a reading, and the licence. `section` names the part a
 * footer link asked for.
 */
export function About({ section }: { section?: string }) {
  const { t } = useI18n();
  useEffect(() => {
    if (section)
      document.getElementById(`about-${section}`)?.scrollIntoView?.();
  }, [section]);
  const parts: [string | undefined, string, readonly string[]][] = [
    [undefined, t.aboutWhatTitle, t.aboutWhat],
    ['sources', t.aboutSourcesTitle, t.aboutSources],
    ['privacy', t.aboutPrivacyTitle, t.aboutPrivacy],
    ['licence', t.aboutLicenceTitle, t.aboutLicence],
  ];
  return (
    <article className="about">
      <PageHead title={t.aboutTitle} purpose={t.footerNote} />
      {parts.map(([id, title, paragraphs]) => (
        <section key={title}>
          <h3
            id={id && `about-${id}`}
            tabIndex={-1}
            data-focus={id !== undefined && id === section ? '' : undefined}
          >
            {title}
          </h3>
          {paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
