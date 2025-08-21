import { useEffect } from 'react';
import { Element as ScrollElement, scroller } from 'react-scroll';

let markers = [];
let infoWindows = [];
let placeId = null;
let map = null;
let geocoder = null;

const defaultCenter = {
  lat: 13.7649084,
  lng: 100.5360959
}; //Victory Monument

const GoogleMap = ({ address, onLocationSelected }) => {
  console.log('GoogleMap');

  const searchMode = address.indexOf('__search') !== -1;

  useEffect(() => {
    console.log('useEffect');

    const initializeMap = (options) => {
      console.log('initializeMap');
      const mapOptions = {
        zoom: 15,
        minZoom: 10,
        clickableIcons: false,
        gestureHandling: 'greedy',
        streetViewControl: false,
        ...options
      };

      if (map) {
        map.setCenter(mapOptions.center);
        map.setZoom(mapOptions.zoom);
      } else {
        map = new window.google.maps.Map(
          document.getElementById('googleMap'),
          mapOptions
        );

        map.addListener('click', (e, d, f) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          createMarker(map, { lat, lng }, true);
          // createInfoWindow(map, { lat, lng }, false);
        });
      }
      createMarker(map, mapOptions.center, searchMode);
    };

    const initMapFromAddressText = () => {
      if (!geocoder) {
        geocoder = new google.maps.Geocoder();
      }

      const actualAddress = address.replace('__search', '');

      geocoder.geocode(
        { address: actualAddress, region: 'TH' },
        (results, status) => {
          console.log('geocoding....');
          if (status == 'OK') {
            const { lat, lng } = results[0].geometry.location;
            if (lat && lng) {
              // const addressSecments = actualAddress.split(" ");
              initializeMap({
                center: { lat: lat(), lng: lng() },
                // zoom: addressSecments.length > 2 ? 19 : 15,
                zoom: 15
              });
            }
          } else {
            initializeMap({
              center: defaultCenter,
              // zoom: addressSecments.length > 2 ? 19 : 15,
              zoom: 15
            });

            console.error(
              'Geocode was not successful for the following reason: ' + status
            );
          }
        }
      );
    };

    const loadGoogleMapScript = () => {
      const scriptElem = document.createElement('script');
      scriptElem.type = 'text/javascript';
      scriptElem.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GGMAP_apiKey}&language=th`;
      const firstExistingScript = document.getElementsByTagName('script')[0];
      firstExistingScript.parentNode.insertBefore(
        scriptElem,
        firstExistingScript
      );
      scriptElem.addEventListener('load', (e) => {
        initMapFromAddressText();
      });
    };

    const createMarker = (map, position, pin = false) => {
      console.log('createMarker');

      markers.forEach((mk) => mk.setMap(null));
      infoWindows.forEach((iw) => iw.setMap(null));

      const marker = new window.google.maps.Marker({
        position: position,
        draggable: true,
        map: map
      });

      marker.addListener('dragstart', () => {
        infoWindows.forEach((iw) => iw.setMap(null));
      });

      marker.addListener('dragend', () => {
        const currentLatitude = marker.position.lat();
        const currentLongitude = marker.position.lng();
        const newPosition = { lat: currentLatitude, lng: currentLongitude };
        position = newPosition;
        onLocationSelected(newPosition);
        createInfoWindow(map, newPosition, false);
      });

      // marker.addListener("click", () => {
      //   console.log("marker click");
      //   alert("map click");
      //   // infoWindows.forEach((iw) => iw.setMap(null));
      //   createInfoWindow(map, position, false);
      // });

      markers.push(marker);

      if (pin) {
        createInfoWindow(map, position, false);
        onLocationSelected(position);
      } else {
        createInfoWindow(map, position, true);
        onLocationSelected(null);
      }

      scroller.scrollTo('googleMap', {
        duration: 1000,
        delay: 500,
        smooth: true
      });
    };

    if (!window.google) {
      loadGoogleMapScript();
    } else {
      initMapFromAddressText();
    }
  }, [address, searchMode, onLocationSelected]);

  const createInfoWindow = (map, position, isFirstMarker) => {
    console.log('createInfoWindow');

    let contentText = isFirstMarker
      ? 'รอปักหมุดที่ตั้งทรัพย์'
      : `พิกัด ${position.lat.toFixed(4)},${position.lng.toFixed(4)} (ปักหมุดแล้ว)<br>
     
      `;

    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div class="text-center md:text-lg font-sans ${
        isFirstMarker ? 'text-primary' : 'text-green-600'
      }">${contentText}<div class='text-gray-400 text-xs italic'>คลิกบนแผนที่หรือลากหมุดสีแดงหากต้องการเปลี่ยนจุดปักหมุด</div></div>`,
      position: position,
      pixelOffset: new google.maps.Size(0, -42)
    });

    infoWindow.addListener('domready', () => {
      return <infoWindow />;
    });

    infoWindows.push(infoWindow);
    infoWindow.open({ map, shouldFocus: false });
  };

  return (
    <ScrollElement name="googleMap">
      <div
        id="googleMap"
        style={{
          height: '100vh',
          width: '100%',
          margin: '0 auto'
        }}
        className="mt-2"
      ></div>
    </ScrollElement>
  );
};

export default GoogleMap;
