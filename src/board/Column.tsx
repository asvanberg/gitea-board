import * as gitea from "../gitea.ts";
import Card from "./Card.tsx";

export type ColumnProps = {
  header: string;
  issues: gitea.Issue[];
};

export default function Column({ header, issues }: ColumnProps) {
  return (
    <div className={"column"}>
      <h2>
        {header} ({issues.length})
      </h2>
      <div className={"cards"}>
        {issues.map((issue) => (
          <Card issue={issue} key={issue.number} />
        ))}
      </div>
    </div>
  );
}
