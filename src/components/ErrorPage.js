import { Link } from "react-router-dom";

export default function ErrorPage() {
    return (
        <div className="errorPageDiv">
            <h2>There was an error loading the page.</h2>
            <p>Please try again!</p>
            <Link to={"/location"} className="getStartedButton blueButton">
                Go Back
            </Link>
        </div>
    )
}