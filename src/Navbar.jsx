function Navbar({ onSearch }) {
  return (
    <nav className="navbar">
      <h2>CineTrack</h2>

      <input
  type="text"
  placeholder="Search movies..."
  onChange={(event) => onSearch(event.target.value)}
/>
    </nav>
  );
}

export default Navbar;
