import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import VectorLayer from "ol/layer/Vector";
import { Source } from "ol/source";
import { Stroke, Style } from "ol/style";

let shelterLayer = new VectorLayer({
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
