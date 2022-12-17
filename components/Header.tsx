import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header id="main-header">
      <Link to="/">Films</Link>
      <Link to="/">Tv shows</Link>
      <Link to="/genres">Genres</Link>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              let value: string = e.currentTarget.value;
              if (value != "" && value != null) {
                console.log(value);
              }
            }
          }}
        />
      </div>
    </header>
  );
}
