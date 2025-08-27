import React, { Children, ReactNode } from "react";

interface ShowProps {
  children: ReactNode;
}

interface WhenProps {
  isTrue: boolean;
  children: ReactNode;
}

interface ElseProps {
  render?: ReactNode;
  children?: ReactNode;
}

const Show: React.FC<ShowProps> & {
  When: React.FC<WhenProps>;
  Else: React.FC<ElseProps>;
} = ({ children }) => {
  const renderChild = (child: ReactNode): ReactNode | null => {
    if (!React.isValidElement(child)) return null;

    if (
      child.props &&
      typeof child.props === "object" &&
      "isTrue" in child.props &&
      child.props.isTrue === true
    ) {
      return (child.props as WhenProps).children;
    }

    if (!("isTrue" in (child.props as Record<string, unknown>))) {
      const props = child.props as ElseProps;
      return props.render ?? props.children;
    }

    return null;
  };
  // Todo: fix this type issue with Children.map and find method chaining
  return Children.map(children, renderChild).find(Boolean) ?? null;
};

/**
 * Conditionally renders children when isTrue is true
 */
Show.When = ({ isTrue, children }: WhenProps) => (isTrue ? children : null);

/**
 * Renders either the render prop or children when shown
 */
Show.Else = ({ render, children }: ElseProps) => render ?? children;

export default Show;
