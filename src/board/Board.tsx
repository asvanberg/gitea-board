import { useEffect, useState } from "react";
import * as gitea from "../gitea.ts";
import Column from "./Column.tsx";

export type BoardProps = {
  owner: string;
  repo: string;
  since?: string;
};

export function Board({ owner, repo, since: sinceDate }: BoardProps) {
  const since = sinceDate ? `${sinceDate}T00:00:00Z` : undefined;

  const [issues, setIssues] = useState<gitea.Issue[]>([]);
  const [pullRequests, setPullRequests] = useState<gitea.Issue[]>([]);

  const [unreleased, setUnreleased] = useState<number[]>([]);

  useEffect(() => {
    void gitea
      .findIssues({
        owner: owner,
        repo: repo,
        state: "open",
        limit: 1000,
        type: "issues",
      })
      .then(({ data }) => {
        setIssues(data);
      });
  }, [owner, repo, since]);

  useEffect(() => {
    void gitea
      .findIssues({
        owner: owner,
        repo: repo,
        since: since,
        state: "all",
        limit: 1000,
        type: "pulls",
      })
      .then(({ data }) => {
        setPullRequests(data);
      });
  }, [owner, repo, since]);

  useEffect(() => {
    void gitea
      .compareCommits({
        owner: owner,
        repo: repo,
        basehead: "master...develop",
      })
      .then(({ data: diff }) => {
        for (const commit of diff.commits ?? []) {
          if (!commit.sha) continue;

          void gitea
            .getMergedPr({ owner, repo, sha: commit.sha })
            .then(({ data }) => {
              if (data.number) {
                const n = data.number;
                setUnreleased((unreleased) => [...unreleased, n]);
              }
            });
        }
      });
  }, [owner, repo]);

  const newIssues = issues.filter((issue) => isNew(issue));

  const todo = issues
    .filter((issue) => issue.state === "open")
    .filter((issue) => !issue.assignees)
    .filter((issue) => !isNew(issue))
    .sort((a, b) => {
      const aDueDate = gitea.getDueDate(a);
      const bDueDate = gitea.getDueDate(b);

      if (aDueDate && bDueDate) {
        return aDueDate < bDueDate ? -1 : 1;
      } else if (aDueDate) {
        return -1;
      } else if (bDueDate) {
        return 1;
      }
      return 0;
    });

  const mergedPRs = pullRequests
    .filter((pr) => pr.state === "closed")
    .filter((pr) => pr.pull_request?.merged_at) // only merged PRs, not just closed
    .filter(
      (pr) =>
        !since ||
        (pr.pull_request?.merged_at && pr.pull_request.merged_at >= since),
    );

  const done = mergedPRs.filter(
    (pr) => pr.number && unreleased.includes(pr.number),
  );

  const released = mergedPRs.filter(
    (pr) => pr.number && !unreleased.includes(pr.number),
  );

  return (
    <div className={"board"}>
      <Column header={"New"} issues={newIssues} />
      <Column header={"To Do"} issues={todo} />
      <Column
        header={"In Progress"}
        issues={issues.filter(
          (issue) => issue.state === "open" && issue.assignees,
        )}
      />
      <Column
        header={"Technical review"}
        issues={pullRequests.filter(
          (pr) => pr.state === "open" && !pr.pull_request?.draft,
        )}
      />
      <Column header={"Done"} issues={done} />
      <Column header={"Released"} issues={released} />
    </div>
  );
}

function isNew(issue: gitea.Issue) {
  return issue.labels?.some((label) => label.name === "new");
}
