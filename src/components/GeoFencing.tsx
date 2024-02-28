import { FormEvent, useRef, useState } from "react";
import { isInsideZone } from "../utils/isInsideZone";

function GeoFencing({ paths }: { paths: number[][] }) {
  const latRef = useRef<HTMLInputElement | null>(null);
  const lngRef = useRef<HTMLInputElement | null>(null);

  const [isInsideRegion, setIsInsideRegion] = useState<Boolean | null>(null);
  function checkGeoFencing(e: FormEvent) {
    e.preventDefault();
    const lat = latRef.current?.valueAsNumber;
    const lng = lngRef.current?.valueAsNumber;
    console.log(lat, lng);
    
    if (lng && lat) {
      setIsInsideRegion(isInsideZone(paths, [lat, lng]));
    }
  }

  return (
    <div>
      {paths.length > 0 ? (
        <div>
          <h2>Geofencing</h2>
          <form onSubmit={checkGeoFencing}>
            <input ref={latRef} type="number" style={{ padding: "6px" }} name="lat" placeholder="lat" />
            <input ref={lngRef} type="number" style={{ padding: "6px" }} name="lng" placeholder="lng" />
            <input type="button" onClick={checkGeoFencing} value="check" style={{ padding: "4px 10px" }} />
          </form>
          <p>IsInsideRegion : {isInsideRegion === null ? "pending" : `${isInsideRegion}`}</p>
        </div>
      ) : null}
    </div>
  );
}

export default GeoFencing;
