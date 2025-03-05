import { Fetcher } from "openapi-typescript-fetch";
import { paths } from "./lib/api/v1";

const client = Fetcher.for<paths>();

client.configure({
  baseUrl: import.meta.env.VITE_GITEA_API_BASE_URL,
});

export type Issue =
  paths["/repos/{owner}/{repo}/issues"]["get"]["responses"]["200"]["schema"][0];

export const findIssues = client
  .path("/repos/{owner}/{repo}/issues")
  .method("get")
  .create();

export type Repository =
  paths["/repos/{owner}/{repo}"]["get"]["responses"]["200"]["schema"];

export const getRepo = client
  .path("/repos/{owner}/{repo}")
  .method("get")
  .create();
