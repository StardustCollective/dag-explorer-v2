"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ComponentProps, createContext, useContext } from "react";

const NavLinkContext = createContext<{ active: boolean }>({ active: false });

export type INavLinkProps = ComponentProps<typeof Link> & {
  href: string;
  exact?: boolean;
  activeClassName?: string;
};

export const NavLink = Object.assign(
  function NavLink({
    href,
    exact = false,
    className,
    activeClassName,
    ...props
  }: INavLinkProps) {
    const pathname = usePathname();

    const isActive = exact ? pathname === href : pathname.startsWith(href);

    return (
      <NavLinkContext.Provider value={{ active: isActive }}>
        <Link
          href={href}
          className={clsx(className, isActive && activeClassName)}
          {...props}
        />
      </NavLinkContext.Provider>
    );
  },
  {
    Content: function NavLinkContent({
      renderCondition,
      children,
    }: {
      renderCondition?: boolean;
      children: React.ReactNode;
    }) {
      const { active } = useContext(NavLinkContext);

      if (!!active === !!renderCondition) {
        return children;
      }

      return null;
    },
  }
);
