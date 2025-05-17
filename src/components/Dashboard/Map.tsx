"use client";

import "leaflet/dist/leaflet.css";
import React, { useMemo, useRef, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import brazilMapData from "@/mapInfo/brazilGeoJson";
import {
  DashboardDataProps,
  MarkerWithHoverProps,
  SpeciesData,
} from "@/types/dashboard";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { getColorForSpecies, PieChartIcon } from "@/utils/handleGraph";
import { map_graph_title } from "@/styles/tailwind_classes";

const MarkerWithHover = ({
  position,
  icon,
  data,
  state,
}: MarkerWithHoverProps) => {
  const markerRef = useRef<L.Marker>(null);
  const popupRef = useRef<L.Popup>(null);

  useEffect(() => {
    if (markerRef.current && popupRef.current) {
      const marker = markerRef.current;

      marker.on("mouseover", () => {
        marker.openPopup();
      });

      marker.on("mouseout", () => {
        marker.closePopup();
      });
    }
  }, []);

  // Sort the species by quantity
  const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <Marker ref={markerRef} position={position} icon={icon}>
      <Popup ref={popupRef} className="custom-popup">
        <div>
          <strong style={{ fontSize: "16px" }}>{state}</strong>
          <ul style={{ marginTop: "8px", fontSize: "14px" }}>
            {sortedEntries.map(([species, count]) => (
              <li
                key={species}
                style={{
                  color: getColorForSpecies(species),
                  marginBottom: "4px",
                }}
              >
                {species}: <strong>{count}</strong>
              </li>
            ))}
          </ul>
        </div>
      </Popup>
    </Marker>
  );
};

const Map: React.FC<DashboardDataProps> = ({ lang, data }) => {
  const {
    dictionary: { Dashboard },
  } = getTranslateClient(lang);

  const groupedData = useMemo(() => {
    const result: Record<
      string,
      { speciesCounts: SpeciesData; coords: [number, number] }
    > = {};

    data.forEach(({ state, species, latitude, longitude }) => {
      if (!result[state]) {
        result[state] = {
          speciesCounts: {},
          coords: [latitude, longitude],
        };
      }

      if (!result[state].speciesCounts[species]) {
        result[state].speciesCounts[species] = 0;
      }

      result[state].speciesCounts[species]++;
    });

    return result;
  }, [data]);

  return (
    <>
      <h2 className={map_graph_title}>{Dashboard.map.title}</h2>
      <div className="flex flex-row justify-center items-center p-2">
        <MapContainer
          className="h-[100vh] 2xl:w-[55vw] xl:w-[65vw] w-[90vw] sticky"
          center={[-14.2400732, -54.1805017]}
          zoom={4.5}
          zoomDelta={0.25}
          zoomControl={false}
          scrollWheelZoom={false}
          touchZoom={false}
          doubleClickZoom={false}
          boxZoom={false}
          dragging={true}
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
          />

          {Object.entries(groupedData).map(
            ([state, { speciesCounts, coords }]) => {
              if (
                !coords[0] ||
                !coords[1] ||
                isNaN(coords[0]) ||
                isNaN(coords[1])
              ) {
                console.warn(`Coordenadas inválidas para ${state}:`, coords);
                return null;
              }

              return (
                <MarkerWithHover
                  key={state}
                  position={[coords[0], coords[1]]}
                  icon={PieChartIcon({ data: speciesCounts })}
                  data={speciesCounts}
                  state={state}
                />
              );
            }
          )}
        </MapContainer>

        <style>{`
        .pie-chart-icon {
          background: transparent;
          border: none;
          }
          .custom-popup .leaflet-popup-content-wrapper {
            border-radius: 6px;
            }
            .custom-popup .leaflet-popup-content {
              margin: 10px;
              line-height: 1.5;
              }
              `}</style>
      </div>
    </>
  );
};

export default Map;
