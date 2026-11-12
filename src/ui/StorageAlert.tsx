import type { StorageProblem } from '../features/history';
import { useI18n } from './i18n';

/** Says why the journal could not be written, where it was written from. */
export function StorageAlert({ problem }: { problem?: StorageProblem }) {
  const { t } = useI18n();
  if (!problem) return null;
  return (
    <p role="alert" className="note note-error">
      {problem === 'full' ? t.storageFull : t.storageBlocked}
    </p>
  );
}
