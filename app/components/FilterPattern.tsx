type FilterPatternProps = {
  filterPatterns: string[];
  checkedFilterPatterns: string[];
  setCheckedFilterPatterns: React.Dispatch<React.SetStateAction<string[]>>;
  isIn: boolean;
};

const FilterPattern: React.FC<FilterPatternProps> = ({
  filterPatterns,
  checkedFilterPatterns,
  setCheckedFilterPatterns,
  isIn,
}) => {
  const isInInfo = isIn ? "is in" : "is not in";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (checkedFilterPatterns.includes(e.target.value)) {
      // フィルタリストに追加済みの場合は削除
      setCheckedFilterPatterns(
        checkedFilterPatterns.filter(
          (filterPattern: string) => filterPattern !== e.target.value
        )
      );
    } else {
      const targetFilterPatterns = filterPatterns.find(
        (filterPattern: string) => filterPattern === e.target.value
      );
      setCheckedFilterPatterns([
        ...checkedFilterPatterns,
        targetFilterPatterns!,
      ]);
    }
  };

  return (
    <>
      <div className="basis-1/6">
        {isInInfo}
        <div>
          <ul
            className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500"
            aria-labelledby="dropdownSearchButton"
          >
            {filterPatterns &&
              filterPatterns.map((filterPattern: string) => (
                <li key={filterPattern}>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      id={filterPattern}
                      type="checkbox"
                      value={filterPattern}
                      checked={checkedFilterPatterns.includes(filterPattern)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      onChange={handleChange}
                    />
                    <label
                      for={filterPattern}
                      className="w-full max-w-[20vh] text-xs font-medium text-gray-900 rounded dark:text-gray-300 ml-3"
                    >
                      {filterPattern}
                    </label>
                  </div>
                </li>
              ))}
          </ul>

          <div className="">
            <button className="w-full bg-red-300 hover:bg-red-400 text-white mt-3 px-4 py-2">
              Add Pattern
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPattern;
