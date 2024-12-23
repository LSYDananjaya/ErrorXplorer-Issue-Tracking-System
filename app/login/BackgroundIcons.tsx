import React from "react";
import { BsTerminal } from "react-icons/bs";
import { BiSolidCommentError } from "react-icons/bi";
import { FaBug } from "react-icons/fa";
import { AiFillAlert } from "react-icons/ai";
import { MdError } from "react-icons/md";
import "./BackgroundIcons.css"; // Ensure you have the necessary styles

const icons = [
  {
    component: BsTerminal,
    className: "terminal-icon",
    positions: [
      { top: "10%", left: "10%" },
      { top: "30%", left: "30%" },
      { top: "50%", left: "10%" },
      { top: "70%", left: "30%" },
      { top: "90%", left: "10%" },
    ],
  },
  {
    component: BiSolidCommentError,
    className: "comment-error-icon",
    positions: [
      { top: "10%", left: "50%" },
      { top: "30%", left: "70%" },
      { top: "50%", left: "50%" },
      { top: "70%", left: "70%" },
      { top: "90%", left: "50%" },
    ],
  },
  {
    component: FaBug,
    className: "bug-icon",
    positions: [
      { top: "10%", left: "90%" },
      { top: "30%", left: "90%" },
      { top: "50%", left: "90%" },
      { top: "70%", left: "90%" },
      { top: "90%", left: "90%" },
    ],
  },
  {
    component: AiFillAlert,
    className: "alert-icon",
    positions: [
      { top: "20%", left: "20%" },
      { top: "40%", left: "40%" },
      { top: "60%", left: "20%" },
      { top: "80%", left: "40%" },
      { top: "100%", left: "20%" },
    ],
  },
  {
    component: MdError,
    className: "error-icon",
    positions: [
      { top: "20%", left: "80%" },
      { top: "40%", left: "80%" },
      { top: "60%", left: "80%" },
      { top: "80%", left: "80%" },
      { top: "100%", left: "80%" },
    ],
  },
];

const BackgroundIcons = () => {
  return (
    <div className="background-icons">
      {icons.map((icon, iconIndex) => {
        const IconComponent = icon.component;
        return icon.positions.map((position, positionIndex) => (
          <IconComponent
            key={`${iconIndex}-${positionIndex}`}
            className={`icon ${icon.className}`}
            style={{ top: position.top, left: position.left }}
          />
        ));
      })}
    </div>
  );
};

export default BackgroundIcons;
