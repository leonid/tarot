# Dependency audit

Checked 2026-11-10. **Re-check by 2026-12-10**, or sooner when `typescript-eslint` ships a release (see "When to act").

## Result

| Command                | Result                              |
| ---------------------- | ----------------------------------- |
| `npm audit --omit=dev` | 0 vulnerabilities                   |
| `npm audit`            | 7 moderate, all from one advisory   |

Nothing that ships to users is affected.

## The advisory

- **Package:** `minimatch`, versions 7.0.0 to 11.0.0. Installed: 10.2.6.
- **Advisory:** [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249), a possible denial of service when matching a hostile glob pattern. Severity: moderate.
- **Path:** `typescript-eslint` 8.72.2 → `@typescript-eslint/typescript-estree` → `minimatch` `^10.2.2`. The seven findings are this one package counted once per `typescript-eslint` sub-package.
- **Where it runs:** only in `npm run lint`, on a developer machine or in CI. It is not in the built site.

## Decision: accept and track

Decision 12 in `full-app-plan.md`. Reasons:

1. **No route for an attacker.** The flaw needs a hostile glob pattern. The only patterns `minimatch` sees here are our own, from `eslint.config.js` and the TypeScript config.
2. **The offered fix is worse.** `npm audit fix --force` installs `typescript-eslint` 8.36.0, a downgrade from 8.72.2, which npm marks as a breaking change.
3. **No clean upgrade exists yet.** 8.72.2 is the latest `typescript-eslint`, and it still asks for `minimatch` `^10.2.2`. The fixed `minimatch` starts at 11.0.1, a new major version.

Not done: forcing `minimatch` 11 through an npm `overrides` entry. It would silence the report by running the linter on a major version its authors have not tested.

## When to act

- `typescript-eslint` releases a version that depends on `minimatch` 11.0.1 or later: upgrade, run `npm audit`, delete the advisory section above.
- `npm audit --omit=dev` reports anything: treat it as a real issue at once, since that is shipped code.
- A new advisory appears in `npm audit`: add it here with the same four facts (package, advisory, path, where it runs) and a decision.

## How to re-check

```
npm audit --omit=dev
npm audit
npm view typescript-eslint version
npm view @typescript-eslint/typescript-estree@latest dependencies.minimatch
```

Update the two dates at the top after each check.
