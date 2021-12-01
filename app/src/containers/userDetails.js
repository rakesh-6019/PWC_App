import React from "react";
import LocationOn from "@material-ui/icons/LocationOn";

export function UserDetails(props) {
  const {
    address: { suite, street, city, zipcode, geo },
  } = props;
  return (
    <div style={{ padding: "1rem" }}>
      <h3 style={{ display: "inline-block" }}>Address:</h3>
      <p
        style={{ display: "inline-block", marginLeft: "5px" }}
      >{`${suite}, ${street}, ${city}(${zipcode})`}</p>
      <a
        className="App-link"
        href={`https://www.google.com/maps/search/?api=1&query=<${geo.lat}>,<${geo.lng}>`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <LocationOn style={{marginBottom: '-5px'}}/>
      </a>
    </div>
  );
}
