import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
const Container: React.FC<Props> = ({ children, ...props }) => {
  return <div className={`container ${props.className}`}>{children}</div>;
};

export default Container;
