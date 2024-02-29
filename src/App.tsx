import { useJsApiLoader } from "@react-google-maps/api";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import GeoFencing from "./components/GeoFencing";
function App() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["drawing"],
  });

  const [paths, setPaths] = useState<number[][]>([]);

  return (
    <>
      <div>Google Maps Drawing</div>
      <div style={{ height: "calc(100vh - 250px)", width: "100%" }}>
        {isLoaded && (
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
              mapId={"1"}
              defaultCenter={{ lat: 22.54992, lng: 0 }}
              defaultZoom={3}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
            />
            {paths.length > 0 ? <p>{JSON.stringify(paths, null, 4)}</p> : null}
            <MyComponent
              setPaths={(paths) => {
                setPaths(paths);
              }}
            />
            <GeoFencing paths={paths} />
          </APIProvider>
        )}
      </div>
    </>
  );
}

export default App;

const MyComponent = ({ setPaths }: { setPaths: (paths: number[][]) => void }) => {
  const map = useMap();

  useEffect(() => {
    const drawing = google.maps.drawing;
    if (!drawing) return;
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      drawingControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_LEFT,
        // drawingModes: [
        //   google.maps.drawing.OverlayType.MARKER,
        //   google.maps.drawing.OverlayType.CIRCLE,
        //   google.maps.drawing.OverlayType.POLYGON,
        //   google.maps.drawing.OverlayType.POLYLINE,
        //   google.maps.drawing.OverlayType.RECTANGLE,
        // ],
      },
      // markerOptions: {
      //   icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      // },
      // circleOptions: {
      //   fillColor: "#ffff00",
      //   fillOpacity: 1,
      //   strokeWeight: 5,
      //   clickable: false,
      //   editable: true,
      //   zIndex: 1,
      // },
    });
    // #NOTE : The types that are in this library are not accurate
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    drawingManager.addListener("overlaycomplete", (e) => {
      if (e.type === google.maps.drawing.OverlayType.POLYGON) {
        const paths = e.overlay
          .getPath()
          .getArray()
          // #NOTE : The types that are in this library are not accurate
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .map((p) => [p.lat(), p.lng()]);
        console.log("paths", paths);
        setPaths(paths);
      }
    });

    drawingManager.setMap(map);
    // }

    return () => {
      if (drawing) {
        drawingManager.setMap(null);
      }
    };
  }, [map]);

  return <>...</>;
};
