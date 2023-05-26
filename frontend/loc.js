
function getNearbyHospitals(latitude, longitude) {
     const radius = 10000; // Radius in meters
    // const apiKey = 'ffc0af6a08924619949d6929846f0562'; // Replace with your OpenCage API key
  
    // const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=hospital&proximity=${latitude},${longitude}&radius=${radius}&key=${apiKey}`;
  
    const overpassUrl = `https://overpass-api.de/api/interpreter`;
  const query = `[out:json];
                  (
                    node["amenity"="hospital"](around:${radius},${latitude},${longitude});
                    way["amenity"="hospital"](around:${radius},${latitude},${longitude});
                    relation["amenity"="hospital"](around:${radius},${latitude},${longitude});
                  );
                  out body;
                  >;
                  out skel qt;`;

  const apiUrl = `${overpassUrl}?data=${encodeURIComponent(query)}`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const hospitals = data.results;
          // Process the list of hospitals
          hospitals.forEach(hospital => {
            console.log('-Name:', hospital.formatted);
            console.log('Latitude:', hospital.geometry.lat);
            console.log('Longitude:', hospital.geometry.lng);
            console.log('--------------------');
          });
        } else {
          console.log('No nearby hospitals found');
        }
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }
  
  // Example usage:
  const latitude = 37.7749;
  const longitude = -122.4194;

  getNearbyHospitals(latitude, longitude);
  