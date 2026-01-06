import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-50 h-16 bg-white border-b border-gray-200 flex items-center px-6">
      {/* HAMBURGER — ALWAYS VISIBLE */}
      <button
        onClick={onMenuClick}
        className="mr-4 text-xl text-gray-700 hover:text-gray-900 focus:outline-none"
        aria-label="Toggle menu"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      <div className="flex-1 text-sm text-gray-600">
        Institute Management Panel
      </div>

      <button className="flex items-center gap-2 text-sm text-red-600 hover:underline">
        <FontAwesomeIcon icon={faRightFromBracket} />
        Logout
      </button>
    </header>
  );
};

export default Topbar;

