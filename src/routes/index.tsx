import * as React from "react";
import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import "@esri/calcite-components/components/calcite-list";
import "@esri/calcite-components/components/calcite-list-item";
import "@esri/calcite-components/components/calcite-loader";
import fetchPlants from "../services/plants";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const navigate = useNavigate();
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    fetchPlants().then((items) => setItems(items));
  }, []);

  return (
    <calcite-list label="Power Plants" scale="l" selectionMode="single">
      {items.length === 0 ? (
        <calcite-loader label="...loading"></calcite-loader>
      ) : (
        items.map((item) => (
          <calcite-list-item
            key={item}
            label={item}
            value={item}
            onClick={() => {
              navigate({
                to: "/map",
                search: { filter: item },
              });
            }}
          ></calcite-list-item>
        ))
      )}
    </calcite-list>
  );
}
