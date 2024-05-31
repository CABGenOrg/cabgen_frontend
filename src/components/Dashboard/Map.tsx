"use client";

import "leaflet/dist/leaflet.css";
import React from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Popup,
} from "react-leaflet";
import brazilMapData from "@/mapInfo/brazilGeoJson";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/redux/slices/languageSlice";

const Map = () => {
  const lang = useSelector(selectCurrentLanguage);

  const onEachState = (state: any, layer: any) => {
    const stateName: string = state.properties.name;
    layer.bindPopup(stateName);

    layer.on({
      mouseover: (event: any) => {
        event.target.openPopup();
        event.target.setStyle({
          fillColor: "black",
        });
      },
      mouseout: (event: any) => {
        event.target.setStyle({
          fillColor: "#A9A9A9",
        });
      },
    });
  };

  return (
    <div className="flex flex-row justify-center items-center p-2">
      <MapContainer
        className="h-[100vh] 2xl:w-[55vw] xl:w-[65vw] w-[90vw] sticky"
        center={[-14.2400732, -54.1805017]}
        zoom={4.5}
        zoomDelta={.25}
        zoomControl={false}
        scrollWheelZoom={false}
        touchZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        dragging={false}
      >
        <TileLayer
          url="http://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <GeoJSON
          style={{
            color: "#000000",
            fillColor: "#A9A9A9",
            fillOpacity: 0.5,
            weight: 0.5,
          }}
          // @ts-expect-error
          data={brazilMapData.features}
          onEachFeature={onEachState}
        />
        <CircleMarker
          center={[-19.9, -43.9]}
          radius={20}
          opacity={0.8}
          stroke={false}
          color="red"
        >
          <Popup className="text-center">
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </CircleMarker>
      </MapContainer>
    </div>
  );
};

export default Map;
