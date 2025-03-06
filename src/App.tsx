import { Board } from "./board/Board.tsx";
import { useEffect, useState } from "react";
import * as gitea from "./gitea.ts";

function App() {
  const owner = import.meta.env.VITE_GITEA_OWNER;
  const repo = import.meta.env.VITE_GITEA_REPO;

  const [since, setSince] = useState(() => {
    const now = new Date();
    now.setDate(now.getDate() - 6);
    now.setUTCHours(0, 0, 0, 0);
    return now.toISOString().substring(0, 10);
  });

  const [repository, setRepository] = useState<gitea.Repository | undefined>();

  useEffect(() => {
    document.title = `${owner}/${repo} since ${since}`;
  }, [owner, repo, since]);

  useEffect(() => {
    void gitea.getRepo({ owner, repo }).then(({ data }) => {
      setRepository(data);
    });
  }, [owner, repo]);

  return (
    <>
      <header>
        <h1>
          {!repository && (
            <>
              {owner}/{repo}
            </>
          )}
          {repository && (
            <a href={repository.html_url}>{repository.full_name}</a>
          )}
        </h1>
        Since
        <input
          type="date"
          value={since}
          onInput={(event) => {
            setSince((event.target as HTMLInputElement).value);
          }}
        />
      </header>
      <Board owner={owner} repo={repo} since={since} />
    </>
  );
}

export default App;
