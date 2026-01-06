const Toolbar = ({ search, setSearch, filters, right }) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {filters ? <div className="flex flex-wrap items-center gap-2">{filters}</div> : null}
      </div>

      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
};

export default Toolbar;
