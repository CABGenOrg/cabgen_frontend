"use client";

import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import brazilMapData from "@/mapInfo/brazilGeoJson";

const Map = () => {
  return (
    <div className="flex flex-row justify-center items-center p-2">
      <MapContainer
        className="h-[100vh] w-[50vw] sticky"
        center={[-14.2400732, -54.1805017]}
        zoom={5}
      >
        <TileLayer
          url="http://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
        />
        
        <GeoJSON
          style={{ color: "black", fillOpacity: 0.5, weight: 0.5 }}
          // @ts-expect-error
          data={brazilMapData.features}
        />
      </MapContainer>
    </div>
  );
};

export default Map;
