import { Link } from "react-router-dom";

export const FeatureMenuDropDown = () => {
  return (
    <div className="h-50 absolute top-full mb-2 mt-2 flex  flex-row items-center rounded-lg border-2 bg-white font-inter text-sm sm:px-6 md:px-8 lg:px-8 xl:px-6 ">
      <div className="mx-3 my-5 ">
        <Link to="/">
          <ul className=" cursor-pointer  rounded-lg p-3 transition duration-300 hover:bg-gray-100">
            <span className=" font-bold text-black  ">
              Medication Suggester
            </span>

            <div className="mt-1 font-satoshi text-sm text-gray-400">
              Medication recommendations based on symptoms and medical history.
            </div>
          </ul>
        </Link>

        <Link to="/drugSummary">
          <ul className=" cursor-pointer rounded-lg p-3 transition duration-300 hover:bg-gray-100">
            <span className=" font-bold text-black ">
              Medication Summary and Comparison
            </span>
            <div className="mt-1 font-satoshi text-sm  text-gray-400">
              Streamline drug documentation analysis.
            </div>
          </ul>
        </Link>

        {/* <div
          className="mr-9 text-black hover:border-b-2 hover:border-blue-600 hover:text-black hover:no-underline"
          onClick={handleSearchMenu}
        >
          <span className="flex-auto"> Review Lookup</span>
        </div>
        <SearchMenu
          showSearchMenu={showSearchMenu}
          handleSearchMenu={handleSearchMenu}
        /> */}
      </div>
    </div>
  );
};
