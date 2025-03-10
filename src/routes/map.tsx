import * as React from "react";
import { createFileRoute, useMatches } from "@tanstack/react-router";

import "@arcgis/core/assets/esri/themes/light/main.css";
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-legend";
import "@esri/calcite-components/components/calcite-loader";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import { when } from "@arcgis/core/core/reactiveUtils.js";

import { useEffect, useState } from "react";

import "./map.css";

export const Route = createFileRoute("/map")({
  component: MapComponent,
  validateSearch: (search) => {
    return search.filter ? { filter: search.filter } : null;
  },
});

function MapComponent() {
  const matches = useMatches();
  const [filter, setFilter] = useState<string | null>(null);
  const [arcgisViewReady, setArcgisViewReady] = useState(false);

  useEffect(() => {
    if (matches?.length) {
      const match = matches[0];
      if (match.search && "filter" in match.search) {
        setFilter(
          typeof match.search.filter === "string" ? match.search.filter : null,
        );
      }
    }
  }, [matches]);

  async function arcgisViewReadyChangeHandler(
    event: HTMLArcgisMapElement["arcgisViewReadyChange"],
  ) {
    const element = event.target;
    const layer = new FeatureLayer({
      portalItem: {
        id: "a453b9a8ccae4c178ae28621c62307bf",
      },
    });

    if (filter) {
      layer.definitionExpression = `fuel1 = '${filter}'`;
    }

    element.map.layers.add(layer);

    const layerView = await element.whenLayerView(layer);

    when(
      () => !layerView.updating,
      () => {
        setArcgisViewReady(true);
      },
      {
        once: true,
      },
    );

    layer.when(() => {
      element.extent = layer.fullExtent!;
    });
  }

  return (
    <>
      {!arcgisViewReady ? (
        <calcite-loader label="..Map loading"></calcite-loader>
      ) : null}
      <arcgis-map
        basemap="gray-vector"
        onarcgisViewReadyChange={arcgisViewReadyChangeHandler}
      >
        <arcgis-expand position="bottom-left">
          <arcgis-legend respectLayerDefinitionExpression></arcgis-legend>
        </arcgis-expand>
      </arcgis-map>
      )
    </>
  );
}
