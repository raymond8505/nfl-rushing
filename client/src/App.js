import "./App.scss";
import PlayersTable from "./components/PlayersTable";
import columns from "./components/PlayersTable-columns.json";
import { memo } from "react";

function App() {
  return (
    <div className="App">
      <header className="App__header">
        <h1 className="App__title">
          <span className="App__logo" aria-label="The Score"></span>
          <span className="App__name">NFL Rushing</span>
        </h1>
      </header>
      <main className="App__main">
        <PlayersTable columns={columns} />
      </main>
    </div>
  );
}

export default memo(App);
