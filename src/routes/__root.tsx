import * as React from "react";
import {
  Link,
  Outlet,
  createRootRoute,
  useMatches,
  useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import "@esri/calcite-components/dist/calcite/calcite.css";
import "@esri/calcite-components/components/calcite-shell";
import "@esri/calcite-components/components/calcite-navigation";
import "@esri/calcite-components/components/calcite-navigation-logo";
import "@esri/calcite-components/components/calcite-menu";
import "@esri/calcite-components/components/calcite-menu-item";
import { useEffect, useState } from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const matches = useMatches();
  const navigate = useNavigate();
  const [isHome, setIsHome] = useState(false);

  useEffect(() => {
    const match = matches.some((match) => match.id !== "/");
    setIsHome(match);
  }, [matches]);

  return (
    <>
      <calcite-shell content-behind className="calcite-mode-light">
        <calcite-navigation slot="header">
          <calcite-navigation-logo
            heading="Power Plants"
            headingLevel={1}
            slot="logo"
          ></calcite-navigation-logo>
          {isHome ? (
            <calcite-menu
              slot="content-end"
              label="Menu"
              onClick={() => {
                navigate({ to: "/" });
              }}
            >
              <calcite-menu-item
                iconStart="home"
                label="home"
              ></calcite-menu-item>
            </calcite-menu>
          ) : null}
        </calcite-navigation>
        <Outlet />
      </calcite-shell>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
