"use client";
import { faBars, faClose, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import fa_styles from "@fortawesome/fontawesome-svg-core/styles.css";
import { useState } from "react";
import { usePathname } from "next/navigation";
import GuestDropdown from "./GuestDropdown/GuestDropdown";

const navbarStyles = `
  .logo-icon {
    width: 100px;
    height: 100px;
    object-fit: contain;
    margin-right: 10px;
  }
`;

function Navbar({ user, signOutAction }) {
  const [hideMenu, setHideMenu] = useState(true);
  const pathname = usePathname();
  return (
    <>
      <style>{navbarStyles}</style>
      <header>
        <div className="container header-items">
          <Link href="/" className="logo-container">
            <img src="/your-logo.jpg" alt="Paradise Resort" className="logo-icon" />
            <h1 className="logo-text">Paradise Resort</h1>
          </Link>
          <nav className={`navbar ${hideMenu ? "hide-menu" : "show-menu"}`}>
            <ul>
              <li>
                <Link className={pathname === "/" ? "active" : ""} href="/" onClick={() => setHideMenu(true)}>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className={pathname.includes("rooms") ? "active" : ""}
                  href="/rooms"
                  onClick={() => setHideMenu(true)}
                >
                  Rooms
                </Link>
              </li>
              <li>
                <Link
                  href={"/contact"}
                  className={pathname === "/contact" ? "active" : ""}
                  onClick={() => setHideMenu(true)}
                >
                  Contact Us
                </Link>
              </li>
              {!user && (
                <li>
                  <Link
                    className={pathname.includes("account") || pathname === "/signin" ? "active" : ""}
                    href="/signin"
                    onClick={() => setHideMenu(true)}
                  >
                    Guest Area
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <div className="navbar-actions">
            {!user && (
              <Link href="/signin" className="login-icon-button">
                <FontAwesomeIcon icon={faRightToBracket} />
              </Link>
            )}
            {user && <GuestDropdown user={user} signOutAction={signOutAction} />}
            <button onClick={() => setHideMenu(!hideMenu)} className="toggle-menu-button">
              <FontAwesomeIcon icon={hideMenu ? faBars : faClose} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;