import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faAngleLeft,
  faCoffee,
  faPizzaSlice,
  faTShirt,
  faBook,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const SearchItems = ({ apiKey }) => {
  const navigate = useNavigate();
  const [searchItem, setSearchItem] = useState("");
  const { coords } = useParams();
  const handleSubmit = (e, searchItem) => {
    e.preventDefault();
    navigate(`/location/${coords}/${searchItem}`);
  };

  const search = (e) => {
    setSearchItem(e.target.value);
  };

  const fillSearch = (e) => {
    setSearchItem(e.target.textContent);
  };

  return (
    <section className="searchItemSection">
      <div className="wrapper">
        <div className="searchItemDiv">
          <div className="backButtonDiv">
            <Link to={`/location`} className="returnToMain returnLinks">
              <FontAwesomeIcon icon={faAngleLeft} />
              &nbsp;BACK
            </Link>
          </div>
          <form action="" onSubmit={(e) => handleSubmit(e, searchItem)}>
            <div className="searchShopDiv">
              <label htmlFor="name" className="sr-only">
                Where do you want to go?
              </label>
              <input
                type="text"
                id="name"
                onChange={search}
                value={searchItem}
                placeholder="Where do you want to go?"
              />
              <div>
                <FontAwesomeIcon
                  icon={faSearch}
                  className="searchIcon"
                  onClick={(e) => handleSubmit(e, searchItem)}
                ></FontAwesomeIcon>
                <span className="sr-only">Submit search input</span>
              </div>
            </div>
          </form>
          <div className="searchSuggestions">
            <button onClick={fillSearch}>
              <FontAwesomeIcon className="icon" icon={faCoffee} />
              &nbsp;Coffee
            </button>
            <button onClick={fillSearch}>
              <FontAwesomeIcon className="icon" icon={faPizzaSlice} />
              &nbsp;Pizza
            </button>
            <button onClick={fillSearch}>
              <FontAwesomeIcon className="icon" icon={faTShirt} />
              &nbsp;Mall
            </button>
            <button onClick={fillSearch}>
              <FontAwesomeIcon className="icon" icon={faBook} />
              &nbsp;Bookshop
            </button>
            <button onClick={fillSearch}>
              <FontAwesomeIcon className="icon" icon={faUtensils} />
              &nbsp;Restaurant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default SearchItems;
