# Basic project board for Gitea repositories

The "Technical review" and "Done" column are based on pull requests and only from the last week.

## Developing

Start by running `npm install` to install all dependencies.

Create `.env.local` file and define `VITE_GITEA_API_BASE_URL`, `VITE_GITEA_OWNER` and `VITE_GITEA_REPO`
to point to the repository you want to display.

- `npm run dev` to start the development server.
- `npm run lint` to lint
- `npm run format` to reformat
- `npm run build` to build
