"use client";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import axios from "axios";

import {
  GoogleMap,
  Marker,
  LoadScript,
  InfoWindow,
} from "@react-google-maps/api";

interface LatLng {
  lat: number;
  lng: number;
}

export default function Home() {
  const router = useRouter();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [TestData, setTestData] = useState([{ time: String, data: Number }]);
  type Data = { time: StringConstructor; data: NumberConstructor }[];
  const [EditedTestData, setEditedTestData] = useState([
    [{ time: String, data: Number }],
  ]);

  const defaultCenter = {
    lat: 54.88,
    lng: 23.76,
  };
  const [active, setActive] = useState(0);

  const [center, setCenter] = useState<LatLng>(defaultCenter);
  const [markers, setMarkers] = useState<LatLng[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<LatLng | null>(null);
  const [mapOptions, setMapOptions] = useState<{ draggable: boolean }>({
    draggable: true,
  });

  const onSelectMarker = (marker: LatLng) => {
    setMarkers(markers.filter((m) => m !== marker));
  };

  const onMapClick = (e: { latLng: { lat: () => any; lng: () => any } }) => {
    if (markers.length < 4) {
      setMarkers((current) => [
        ...current,
        {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        },
      ]);
      console.log(markers);
    }
  };

  useEffect(() => {
    console.log(markers);
    if (active == 0) {
      FetchTemperature();
    } else if (active == 1) {
      FetchMoisture();
    } else if (active == 2) {
      FetchWindSpeed();
    } else if (active == 3) {
      FetchPreasure();
    }
  }, [markers, startDate, endDate]);

  const onMapDrag = (map: google.maps.Map) => {
    setCenter({ lat: map.getCenter().lat(), lng: map.getCenter().lng() });
  };

  function FetchTemperature() {
    setActive(0);
    const start = startDate.toLocaleDateString();
    const end = endDate.toLocaleDateString();
    setTestData([]);
    for (var i = 0; i < markers.length; i++) {
      axios
        .get(
          `https://api.open-meteo.com/v1/forecast?latitude=` +
            markers[i].lat +
            `&longitude=` +
            markers[i].lng +
            `&hourly=temperature_2m&start_date=` +
            start +
            `&end_date=` +
            end
        )
        .then((res) => {
          for (let y = 0; y < res.data.hourly.time.length; y++) {
            const EditTime = res.data.hourly.time[y].substring(11, 13);
            setTestData((oldData) => [
              ...oldData,
              {
                time: EditTime,
                data: res.data.hourly.temperature_2m[y],
              },
            ]);
          }
        });
    }
  }

  useEffect(() => {
    if (TestData.length > 0) {
      EditData();
    }
  }, [TestData]);

  useEffect(() => {
    console.log(EditedTestData);
  }, [EditedTestData]);

  function FetchMoisture() {
    setActive(1);
    setTestData([]);
    const start = startDate.toLocaleDateString();
    const end = endDate.toLocaleDateString();
    for (var i = 0; i < markers.length; i++) {
      axios
        .get(
          `https://api.open-meteo.com/v1/forecast?latitude=` +
            markers[i].lat +
            `&longitude=` +
            markers[i].lng +
            `&hourly=relative_humidity_2m&start_date=` +
            start +
            `&end_date=` +
            end
        )
        .then((res) => {
          console.log(res.data.hourly.relative_humidity_2m);
          for (let i = 0; i < res.data.hourly.time.length; i++) {
            const EditTime = res.data.hourly.time[i].substring(11, 13);
            setTestData((oldData) => [
              ...oldData,
              {
                time: EditTime,
                data: res.data.hourly.relative_humidity_2m[i],
              },
            ]);
          }
        });
    }
  }

  function FetchWindSpeed() {
    setActive(2);
    setTestData([]);
    const start = startDate.toLocaleDateString();
    const end = endDate.toLocaleDateString();
    for (var i = 0; i < markers.length; i++) {
      axios
        .get(
          `https://api.open-meteo.com/v1/forecast?latitude=` +
            markers[i].lat +
            `&longitude=` +
            markers[i].lng +
            `&hourly=wind_speed_10m&start_date=` +
            start +
            `&end_date=` +
            end
        )
        .then((res) => {
          console.log(res.data.hourly.relative_humidity_2m);
          for (let i = 0; i < res.data.hourly.time.length; i++) {
            const EditTime = res.data.hourly.time[i].substring(11, 13);
            setTestData((oldData) => [
              ...oldData,
              {
                time: EditTime,
                data: res.data.hourly.wind_speed_10m[i],
              },
            ]);
          }
        });
    }
  }

  function FetchPreasure() {
    setActive(3);
    setTestData([]);
    const start = startDate.toLocaleDateString();
    const end = endDate.toLocaleDateString();
    for (var i = 0; i < markers.length; i++) {
      axios
        .get(
          `https://api.open-meteo.com/v1/forecast?latitude=` +
            markers[i].lat +
            `&longitude=` +
            markers[i].lng +
            `&hourly=surface_pressure&start_date=` +
            start +
            `&end_date=` +
            end
        )
        .then((res) => {
          console.log(res.data.hourly.relative_humidity_2m);
          for (let i = 0; i < res.data.hourly.time.length; i++) {
            const EditTime = res.data.hourly.time[i].substring(11, 13);
            setTestData((oldData) => [
              ...oldData,
              {
                time: EditTime,
                data: res.data.hourly.surface_pressure[i],
              },
            ]);
          }
        });
    }
  }

  function EditData() {
    var layer = TestData.length / markers.length;
    console.log(TestData.length);
    console.log(layer);
    var edited = Array(markers.length)
      .fill(0)
      .map(() => Array(layer).fill(0));
    for (var i = 0; i < markers.length; i++) {
      for (var y = 0; y < layer; y++) {
        edited[i][y] = TestData[layer * i + y];
      }
    }
    setEditedTestData(edited);
  }

  const generateLineChart = (data: Data) => (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" stroke="black" />
      <YAxis stroke="black" domain={["dataMin", "dataMax"]} />
      <Line type="monotone" dataKey="data" stroke="black" />
    </LineChart>
  );

  return (
    <div className="bg-gray-200 flex h-screen w-full flex-col items-center">
      <div className="... w-full basis-4 bg1"></div>
      <div className="... w-full basis-1/12 bg1">
        <div className="h-full flex flex-row items-center bg-gray-400">
          <p className="m-2">Start Date:</p>
          <DatePicker
            selected={startDate}
            onChange={() => {
              (date: SetStateAction<Date>) => setStartDate(date);
            }}
            maxDate={new Date().setDate(new Date().getDate() + 15)}
          />
          <p className="m-2">End Date:</p>
          <DatePicker
            selected={endDate}
            onChange={(date: SetStateAction<Date>) => setEndDate(date)}
            maxDate={new Date().setDate(new Date().getDate() + 15)}
            minDate={startDate}
          />
          <button
            className="btn btn-neutral w-32 rounded-full m-4"
            onClick={() => FetchTemperature()}
          >
            Temperature
          </button>
          <button
            className="btn btn-neutral w-32 rounded-full m-4"
            onClick={() => FetchMoisture()}
          >
            Moisture
          </button>
          <button
            className="btn btn-neutral w-32 rounded-full m-4"
            onClick={() => FetchWindSpeed()}
          >
            Wind Speed
          </button>
          <button
            className="btn btn-neutral w-32 rounded-full m-4"
            onClick={() => FetchPreasure()}
          >
            Preasure
          </button>
        </div>
      </div>
      <div className="... w-full basis-6 bg1"></div>
      <div className="... w-full basis-10/12 ">
        <div className="rounded-2xl h-full mx-4 flex flex-row items-center bg-gray-400">
          <div className="rounded-2xl h--full w-1/2 mx-4 flex flex-col items-center bg-gray-500">
            <LoadScript googleMapsApiKey="AIzaSyBo1pgIeHICjZ2bqc-e2ESiSkML1e8G1Jc">
              <GoogleMap
                mapContainerStyle={{ height: "68vh", width: "100%" }}
                center={center}
                zoom={9}
                options={mapOptions}
                onLoad={(map) => {
                  map.setOptions(mapOptions);
                }}
                onClick={onMapClick}
                onDragEnd={() => onMapDrag}
              >
                {markers.map((marker, index) => (
                  <Marker
                    key={index}
                    position={marker}
                    onClick={() => onSelectMarker(marker)}
                  />
                ))}

                {selectedMarker && (
                  <InfoWindow
                    position={selectedMarker}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div>
                      <h2>Marker Information</h2>
                      <p>Latitude: {selectedMarker.lat}</p>
                      <p>Longitude: {selectedMarker.lng}</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>
          <div className="h-5/6 w-1/2 mx-4 flex flex-col items-center bg-gray-500">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {active === 0 && <th>Temperature</th>}
                    {active === 1 && <th>Moisture</th>}
                    {active === 2 && <th>Wind Speed</th>}
                    {active === 3 && <th>Preasure</th>}
                  </tr>
                </thead>
                <tbody>
                  {EditedTestData.map((data, index) => (
                    <tr key={index}>
                      <td>{generateLineChart(data)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="... w-full basis-4 bg1 flex flex-col items-center"></div>
    </div>
  );
}
