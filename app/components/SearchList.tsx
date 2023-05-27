type DataType = "node" | "link";

type SearchListProps = {
  dataType: DataType;
  contentList: string[];
  checkedContentList: string[];
  setCheckedContentList: (contentList: string[]) => void;
  onSubmitContentList: (contentList: string[]) => void;
};

const SearchList: React.FC<SearchListProps> = ({
  dataType,
  contentList,
  checkedContentList,
  setCheckedContentList,
  onSubmitContentList,
}) => {
  const serachPlaceholder = dataType === "node" ? "Search Node" : "Search Link";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (checkedContentList.includes(e.target.value)) {
      // フィルタリストに追加済みの場合は削除
      setCheckedContentList(
        checkedContentList.filter((content) => content !== e.target.value)
      );
    } else {
      setCheckedContentList([...checkedContentList, e.target.value]);
    }
  };

  return (
    <>
      <div className="basis-1/6">
        <div className="p-3">
          <div className="relative">
            <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="input-group-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={serachPlaceholder}
            />
          </div>
        </div>

        <div>
          <ul
            className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-500"
            aria-labelledby="dropdownSearchButton"
          >
            {contentList &&
              contentList.map((content: string) => (
                <li key={content}>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      id={content}
                      type="checkbox"
                      value={content}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      onChange={handleChange}
                    />
                    <label
                      for={content}
                      className="w-full max-w-[20vh] text-xs font-medium text-gray-900 rounded dark:text-gray-300 ml-3"
                    >
                      {content}
                    </label>
                  </div>
                </li>
              ))}
          </ul>

          <div className="">
            <button
              className="w-full bg-red-300 hover:bg-red-400 text-white mt-3 px-4 py-2"
              onClick={onSubmitContentList}
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchList;
