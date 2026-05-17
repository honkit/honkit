# Reports

Generated quality and install reports for the Honkit monorepo.

| Report | Command |
| --- | --- |
| Fresh install log (wiped `node_modules`, regenerated lockfile) | `pnpm run report:install` → `install.log` |
| Install log (CI-shaped, frozen lockfile) | `pnpm run report:install-ci` → `install.log` |

`report:install` removes workspace `node_modules`, deletes `pnpm-lock.yaml`, and runs `pnpm install` so registry deprecation warnings appear in `install.log`. Use before dependency cleanup work; commit the updated lockfile separately when intentional.
