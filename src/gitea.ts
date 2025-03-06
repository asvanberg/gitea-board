import { Fetcher } from "openapi-typescript-fetch";
import { definitions, paths } from "./lib/api/v1";

const client = Fetcher.for<paths>();

client.configure({
  baseUrl: import.meta.env.VITE_GITEA_API_BASE_URL,
});

export type Issue =
  paths["/repos/{owner}/{repo}/issues"]["get"]["responses"]["200"]["schema"][0];

export type Label = definitions["Label"];

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

export const compareCommits = client
  .path("/repos/{owner}/{repo}/compare/{basehead}")
  .method("get")
  .create();

export const getMergedPr = client
  .path("/repos/{owner}/{repo}/commits/{sha}/pull")
  .method("get")
  .create();
