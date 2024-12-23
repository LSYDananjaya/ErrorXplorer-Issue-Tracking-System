"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiFillBug, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import * as Separator from "@radix-ui/react-separator";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as HoverCard from "@radix-ui/react-hover-card";
import * as Dialog from "@radix-ui/react-dialog";
import { useUser, UserProvider } from "./UserContext";
import "./styles.css";

interface NavBarProps {
  onLogout: () => void;
  setShowLogoutDialog: (show: boolean) => void;
}

const NavBar = ({ onLogout, setShowLogoutDialog }: NavBarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUser();

  const currentPath = usePathname();
  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues" },
  ];

  useEffect(() => {
    console.log("NavBar component mounted"); // Debugging component mount
    // Retrieve user data from session storage
    const userData = sessionStorage.getItem("user");
    console.log("User data from session storage:", userData); // Debugging user data
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log("Parsed user data:", parsedUser); // Debugging parsed user data
      setUser(parsedUser);
    }

    // Check if the device is mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setUser]);

  const toggleMobileMenu = () => {
    console.log("Toggling mobile menu"); // Debugging mobile menu toggle
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    console.log("Logging out"); // Debugging logout
    sessionStorage.removeItem("user");
    setUser(null);
    router.push("/login");
    if (onLogout) onLogout();
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <li>
      <Link
        href={href}
        className={classNames(
          "text-white hover:text-gray-300 transition px-3 py-2 rounded glass-effect",
          { "font-bold glass-effect-active": href === currentPath }
        )}
        onClick={() => {
          console.log(`Navigating to ${href}`); // Debugging navigation
          setIsMobileMenuOpen(false);
        }}
      >
        {label}
      </Link>
    </li>
  );

  const AuthLinks = () => (
    <li className="flex items-center space-x-2">
      <Link
        href="/login"
        className={classNames(
          "text-white hover:text-gray-300 transition px-3 py-2 rounded glass-effect",
          { "font-bold glass-effect-active": currentPath === "/login" }
        )}
      >
        Login
      </Link>
      <Separator.Root
        className="bg-gray-300"
        decorative
        orientation="vertical"
        style={{ width: "1px", height: "24px" }}
      />
      <Link
        href="/register"
        className={classNames(
          "text-white hover:text-gray-300 transition px-3 py-2 rounded glass-effect",
          { "font-bold glass-effect-active": currentPath === "/register" }
        )}
      >
        Register
      </Link>
    </li>
  );

  const UserAvatar = () => {
    console.log("Rendering UserAvatar component"); // Debugging UserAvatar rendering
    return (
      <li className="flex items-center space-x-2 z-50">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Avatar.Root className="inline-flex size-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle">
              <Avatar.Fallback
                className="leading-1 flex size-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
                delayMs={600}
              >
                {user?.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Root>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-black rounded shadow-md p-2">
            <DropdownMenu.Item>
              <HoverCard.Root>
                <HoverCard.Trigger asChild>
                  <button className="text-white hover:bg-opacity-70 hover:backdrop-blur-md hover:bg-gray-800 rounded px-2 py-1">
                    View Profile
                  </button>
                </HoverCard.Trigger>
                <HoverCard.Content
                  side="left"
                  align="start"
                  className="bg-black bg-opacity-70 backdrop-blur-md rounded shadow-md p-4 max-w-xs z-50"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar.Root className="inline-flex size-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle">
                      <Avatar.Fallback
                        className="leading-1 flex size-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
                        delayMs={600}
                      >
                        {user?.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <div>
                      <p className="text-white font-bold">{user?.fullName}</p>
                      <p className="text-gray-400">{user?.email}</p>
                      <p className="text-gray-400">{user?.role}</p>
                    </div>
                  </div>
                </HoverCard.Content>
              </HoverCard.Root>
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 bg-gray-200 h-px" />
            <DropdownMenu.Item>
              {isMobile ? (
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <button className="text-red-600 hover:bg-opacity-70 hover:backdrop-blur-md hover:bg-gray-800 rounded px-2 py-1">
                      Logout
                    </button>
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded shadow-md p-4 max-w-xs z-50">
                      <Dialog.Title className="text-lg font-medium">
                        Logout
                      </Dialog.Title>
                      <Dialog.Description className="mt-2 text-sm text-gray-500">
                        Are you sure you want to logout? This will end your
                        current session.
                      </Dialog.Description>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Dialog.Close asChild>
                          <button
                            className="px-4 py-2 bg-gray-200 rounded"
                            onClick={() => setShowLogoutDialog(false)}
                          >
                            No
                          </button>
                        </Dialog.Close>
                        <button
                          className="px-4 py-2 bg-red-600 text-white rounded"
                          onClick={handleLogout}
                        >
                          Yes
                        </button>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
              ) : (
                <HoverCard.Root>
                  <HoverCard.Trigger asChild>
                    <button className="text-red-600 hover:bg-opacity-70 hover:backdrop-blur-md hover:bg-gray-800 rounded px-2 py-1">
                      Logout
                    </button>
                  </HoverCard.Trigger>
                  <HoverCard.Content
                    side="left"
                    align="start"
                    className="bg-black bg-opacity-70 backdrop-blur-md rounded shadow-md p-4 max-w-xs z-50"
                  >
                    <p className="text-white">
                      Are you sure you want to logout?
                    </p>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        className="px-4 py-2 bg-gray-200 rounded"
                        onClick={() => setShowLogoutDialog(false)}
                      >
                        No
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded"
                        onClick={handleLogout}
                      >
                        Yes
                      </button>
                    </div>
                  </HoverCard.Content>
                </HoverCard.Root>
              )}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </li>
    );
  };

  return (
    <nav className="bg-black p-4 shadow-md z-40">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-xl font-bold text-white space-x-2"
        >
          <AiFillBug />
          <span>ErrorXplorer</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="text-white md:hidden focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <AiOutlineClose size={24} />
          ) : (
            <AiOutlineMenu size={24} />
          )}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-6 mr-4">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
          {user ? <UserAvatar /> : <AuthLinks />}
        </ul>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <ul className="md:hidden mt-4 space-y-4">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
          {user ? <UserAvatar /> : <AuthLinks />}
        </ul>
      )}
    </nav>
  );
};

const App = () => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    console.log("Logging out"); // Debugging logout
    sessionStorage.removeItem("user");
    setShowLogoutDialog(false);
    // Add any additional logout logic here
  };

  return (
    <UserProvider>
      <NavBar
        onLogout={() => setShowLogoutDialog(true)}
        setShowLogoutDialog={setShowLogoutDialog}
      />
    </UserProvider>
  );
};

export default App;
