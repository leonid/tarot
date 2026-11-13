// Unit tests read every language synchronously, so they start with all of them
// loaded; the lazy path itself is covered in store.test.ts.
import { registerLocale } from './content/locales';
import { ru } from './content/locales/ru';
import { makePseudo } from './content/locales/pseudo';

registerLocale(ru);
registerLocale(makePseudo());

// Likewise the card-study text (Waite, formula), which the app fetches on demand.
import { registerStudy } from './ui/useStudy';
import * as study from './ui/studyContent';

registerStudy(study);
