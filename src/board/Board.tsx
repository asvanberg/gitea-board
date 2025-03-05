import { useEffect, useState } from "react";
import * as gitea from "../gitea.ts";
import Column from "./Column.tsx";

export type BoardProps = {
  owner: string;
  repo: string;
  since?: Date;
};

export function Board({ owner, repo, since: sinceDate }: BoardProps) {
  const since = sinceDate?.toISOString();

  const [issues, setIssues] = useState<gitea.Issue[]>([]);
  const [pullRequests, setPullRequests] = useState<gitea.Issue[]>([]);

  useEffect(() => {
    void gitea
      .findIssues({
        owner: owner,
        repo: repo,
        state: "all",
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

  const newIssues = issues.filter((issue) => isNew(issue));

  const todo = issues
    .filter((issue) => issue.state === "open")
    .filter((issue) => !issue.assignees)
    .filter((issue) => !isNew(issue))
    .sort((a, b) => {
      if (a.milestone?.due_on && b.milestone?.due_on) {
        return a.milestone.due_on < b.milestone.due_on ? -1 : 1;
      } else if (a.milestone) {
        return -1;
      } else if (b.milestone) {
        return 1;
      }
      return 0;
    });

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
      <Column
        header={"Done"}
        issues={pullRequests.filter((pr) => pr.state === "closed")}
      />
    </div>
  );
}

function isNew(issue: gitea.Issue) {
  return issue.labels?.some((label) => label.name === "new");
}
