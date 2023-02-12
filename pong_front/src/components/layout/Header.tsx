import { Link } from "react-router-dom";
import { HeaderWrapper } from "./Header.style";
import logo from "../../assets/logo.png";
import { RoutePath } from "../../common/configData";

export default function Header() {
    return (
        <HeaderWrapper>
            <Link to={RoutePath.lobby} style={{ textDecoration: "none" }}>
                <span className="navi-title">
                    <img src={logo} alt="logo" />
                    <span>Pingu Pong</span>
                </span>
            </Link>
        </HeaderWrapper>
    );
}