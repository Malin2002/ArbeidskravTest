import React from "react";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import VectorLayer from "ol/layer/Vector";
import { Map, MapBrowserEvent, Overlay } from "ol";
import { Layer } from "ol/layer";
import { useEffect, useRef, useState } from "react";
import { FeatureLike } from "ol/Feature";

const source = new VectorSource({
  url: "/ArbeidskravTest/geojson/Offentlige-tilfluktsrom.geojson",
  format: new GeoJSON(),
});

const shelterLayer = new VectorLayer({ source });
const overlay = new Overlay({
  positioning: "bottom-center",
});

export function ShelterLayerCheckbox({
  setLayers,
  map,
}: {
  setLayers: (value: (prevState: Layer[]) => Layer[]) => void;
  map: Map;
}) {
  const [checked, setChecked] = useState(true);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [selectedShelters, setSelectedShelters] = useState<FeatureLike[]>([]);

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    setSelectedShelters(map.getFeaturesAtPixel(e.pixel));
    overlay.setPosition(e.coordinate);
  }

  useEffect(() => {
    overlay.setElement(overlayRef.current!);
    map.addOverlay(overlay);
  }, []);

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, shelterLayer]);
      map.on("click", handleClick);
    } else {
      setLayers((old) => old.filter((l) => l !== shelterLayer));
      map.un("click", handleClick); // Remove the event listener
    }
  }, [checked]);

  return (
    <button onClick={() => setChecked((b) => !b)}>
      <input type={"checkbox"} checked={checked} />
      Show shelters on map
      <div ref={overlayRef}>
        Clicked shelters:
        {selectedShelters.map((s, index) => {
          const props = s.getProperties();
          return (
            <p key={index}>
              {" "}
              Adresse: {props.adresse} <br /> Romnummer: {props.romnr} <br />{" "}
              Plasser: {props.plasser}
            </p>
          );
        })}
      </div>
    </button>
  );
}
