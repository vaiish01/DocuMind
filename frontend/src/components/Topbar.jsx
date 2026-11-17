function Topbar({ activePage }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <h1>{activePage}</h1>
          <p>Welcome back! Ready to explore your knowledge?</p>
        </div>
      </div>
    </header>
  );
}

export default Topbar;