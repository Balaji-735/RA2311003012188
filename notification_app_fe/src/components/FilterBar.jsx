const filters = ["All", "Placement", "Result", "Event"];

const FilterBar = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="filter-row" aria-label="Notification filters">
      {filters.map((item) => (
        <button
          className={activeFilter === item ? "filter-button active" : "filter-button"}
          key={item}
          onClick={() => onFilterChange(item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
