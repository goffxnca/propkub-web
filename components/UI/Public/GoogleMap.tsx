import { useEffect } from 'react';
import { Element as ScrollElement, scroller } from 'react-scroll';
import { useTranslation } from '../../../hooks/useTranslation';

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
  const { t } = useTranslation('pages/post-form');
  const searchMode = address.indexOf('__search') !== -1;

  const initMapFromAddressText = () => {
    if (!geocoder) {
      geocoder = new google.maps.Geocoder();
    }

    const actualAddress = address.replace('__search', '');

    geocoder.geocode(
      { address: actualAddress, region: 'TH' },
      (results, status) => {
        if (status == 'OK') {
          const { lat, lng } = results[0].geometry.location;
          if (lat && lng) {
            // const addressSegments = actualAddress.split(" ");
            initializeMap({
              center: { lat: lat(), lng: lng() },
              // zoom: addressSecments.length > 2 ? 19 : 15,
              zoom: 15
            });
          }
        } else {
          initializeMap({
            center: defaultCenter,
            // zoom: addressSegments.length > 2 ? 19 : 15,
            zoom: 15
          });

          console.error(
            'Geocode was not successful for the following reason: ' + status
          );
        }
      }
    );
  };

  useEffect(() => {
    const loadGoogleMapScript = () => {
      const scriptElem = document.createElement('script');
      scriptElem.type = 'text/javascript';
      scriptElem.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GGMAP_API_KEY}&language=th`;
      const firstExistingScript = document.getElementsByTagName('script')[0];
      firstExistingScript.parentNode.insertBefore(
        scriptElem,
        firstExistingScript
      );
      scriptElem.addEventListener('load', (e) => {
        initMapFromAddressText();
      });
    };
    if (!window.google) {
      loadGoogleMapScript();
    } else {
      initMapFromAddressText();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const initializeMap = (options) => {
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

  const createInfoWindow = (map, position, isFirstMarker) => {
    let contentText = isFirstMarker
      ? t('sections.location.map.infoWindow.waiting')
      : t('sections.location.map.infoWindow.pinned', {
          lat: position.lat.toFixed(4),
          lng: position.lng.toFixed(4)
        });

    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div class="text-center md:text-lg font-sans ${
        isFirstMarker ? 'text-primary' : 'text-green-600'
      }">${contentText}<br><div class='text-gray-400 text-xs italic'>${t('sections.location.map.infoWindow.instructions')}</div></div>`,
      position: position,
      pixelOffset: new google.maps.Size(0, -42)
    });

    infoWindow.addListener('domready', () => {
      return <infoWindow />;
    });

    infoWindows.push(infoWindow);
    infoWindow.open({ map, shouldFocus: false });
  };

  const createMarker = (map, position, pin = false) => {
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
