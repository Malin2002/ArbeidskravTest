import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "ol/ol.css";
import { useGeographic } from "ol/proj";
import { Map, View } from "ol";
import { Layer } from "ol/layer";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "./application.css";
import { ShelterLayerCheckbox } from "./modules/layers/sheltersLayerCheckbox";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Stroke, Style } from "ol/style";

useGeographic();

const view = new View({ center: [10.8, 59.9], zoom: 10 });
const map = new Map({ view });

let civilDefenceRegionsLayer = new VectorLayer({
  source: new VectorSource({
    url: "/ArbeidskravTest/geojson/Sivilforsvarsdistrikter.geojson",
    format: new GeoJSON(),
  }),
  style: new Style({
    stroke: new Stroke({
      color: "red",
      width: 2,
    }),
  }),
});

function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({ source: new OSM() }),
    civilDefenceRegionsLayer,
  ]);
  useEffect(() => map.setTarget(mapRef.current!), []);
  useEffect(() => map.setLayers(layers), [layers]);

  function handleClick() {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        view.animate({
          center: [longitude, latitude],
          zoom: 15,
          duration: 500,
        });
      },
    );
  }

  return (
    <>
      <nav>
        <button onClick={handleClick}>Center on me</button>
        <ShelterLayerCheckbox setLayers={setLayers} map={map} />
      </nav>
      <main>
        <div ref={mapRef}></div>
      </main>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<Application />);
