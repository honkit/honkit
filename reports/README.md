# Reports
Generated quality and install reports for the Honkit monorepo.

| Report | Command |
| --- | --- |
| Fresh install log (wiped `node_modules`, regenerated lockfile) | `pnpm run report:install` → `install.log` |

`report:install` removes workspace `node_modules`, deletes `pnpm-lock.yaml`, and runs `pnpm install` so registry deprecation warnings appear in `install.log`. Use before dependency cleanup work; commit the updated lockfile separately when intentional.

CI also runs a non-mutating install audit in [`.github/workflows/test.yml`](../.github/workflows/test.yml):

```bash
NODE_OPTIONS=--trace-deprecation pnpm install --frozen-lockfile
```

Review that job’s log for Node deprecation traces on a frozen lockfile. To fail locally on the same warnings (once resolved upstream), use `NODE_OPTIONS=--throw-deprecation` — see [Node.js deprecations](https://nodejs.org/api/deprecations.html#deprecated-apis).
