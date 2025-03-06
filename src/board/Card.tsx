import * as gitea from "../gitea.ts";
import Label from "./Label.tsx";

export type CardProps = {
  issue: gitea.Issue;
};

export default function Card({ issue }: CardProps) {
  return (
    <div className={"card"}>
      <h3>#{issue.number}</h3>
      <div className={"body"}>
        <a href={issue.html_url}>{issue.title}</a>
        <br />
        {issue.milestone?.due_on && (
          <span className={"due-date"}>
            Due on {issue.milestone.due_on.substring(0, 10)}
          </span>
        )}
        {issue.assignee && (
          <img
            className={"profile-picture"}
            src={issue.assignee.avatar_url}
            alt={issue.assignee.login}
          />
        )}
        {issue.labels && (
          <ul className={"labels"}>
            {issue.labels.map((label) => (
              <li key={label.id}>
                <Label label={label} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
