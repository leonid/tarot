import type { MouseEvent, ReactNode } from 'react';
import { useI18n } from './i18n';
import { hrefOf, navigate, type Page } from './route';

/** A link to one of the app's screens. A real link: it can be opened in a new tab. */
export function PageLink({
  page,
  className,
  current = false,
  children,
}: {
  page: Page;
  className?: string;
  current?: boolean;
  children: ReactNode;
}) {
  function onClick(e: MouseEvent) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    e.preventDefault();
    navigate(page);
  }
  return (
    <a
      href={hrefOf(page)}
      className={className}
      aria-current={current ? 'page' : undefined}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

/** The four places, always on screen, with the current one marked. */
export function Nav({ page }: { page: Page | null }) {
  const { t } = useI18n();
  const items: [Page, string][] = [
    ['home', t.navHome],
    ['reading', t.goalReading],
    ['record', t.goalRecord],
    ['journal', t.goalJournal],
  ];
  return (
    <nav className="nav" aria-label={t.navLabel}>
      <ul>
        {items.map(([id, label]) => (
          <li key={id}>
            <PageLink page={id} current={id === page}>
              {label}
            </PageLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
