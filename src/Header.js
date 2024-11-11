import { Link } from "react-router-dom";
import "./App.css";
export default function Header() {
  return (
    <nav>
      <div>
        <ul>
          <li>
            <Link to="/Home" className="Link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/Tasmi3i" className="Link">
            تسميعي
            </Link>
          </li>
          <li>
            <Link to="/Login" className="Link">
              LogIn
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
