import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";


const SearchItems = ({ apiKey }) => {
  const navigate = useNavigate();
  const [searchItem, setSearchItem] = useState("");
  const {coords} = useParams();
  const handleSubmit = (e, searchItem) => {
    e.preventDefault();
    navigate(`/location/${coords}/${searchItem}`);
  };

  const search = (e) => {
    setSearchItem(e.target.value);
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
              <label htmlFor="name" className="sr-only">
                Enter your search item
              </label>
              <div className="searchShopDiv">
                <span>
                  <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                </span>
                <input
                  type="text"
                  id="name"
                  onChange={search}
                  value={searchItem}
                  placeholder="Where do you want to go?"
                />
              </div>
            </form>
          </div>
        </div>
      </section>
      
  
  );
};
export default SearchItems;
