import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Results from "./Results";

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

  return (
    <>
      <section className="searchItemSection">
        <div className="wrapper">
          <div className="searchItemDiv">
            <h2>Where do you want to go?</h2>
            <form action="" onSubmit={(e) => handleSubmit(e, searchItem)}>
              <label htmlFor="name" className="sr-only">
                Enter your search item
              </label>
              <div className="userLocationDiv">
                <span>
                  <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                </span>
                <input
                  type="text"
                  id="name"
                  onChange={search}
                  value={searchItem}
                  placeholder="Ex: Coffee, Museum, Pizza"
                />
              </div>
            </form>
            <div className="backButtonDiv">
              <Link
                to={`/location`}
                className="backButton returnLinks blueButton"
              >
                BACK
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default SearchItems;
