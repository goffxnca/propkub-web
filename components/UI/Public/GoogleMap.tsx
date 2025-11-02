import { useEffect } from 'react';
import { Element as ScrollElement, scroller } from 'react-scroll';
import { useTranslation } from '../../../hooks/useTranslation';

interface GoogleMapsLatLng {
  lat(): number;
  lng(): number;
}

interface GoogleMapsMapOptions {
  center?: { lat: number; lng: number };
  zoom?: number;
  minZoom?: number;
  clickableIcons?: boolean;
  gestureHandling?: string;
  streetViewControl?: boolean;
}

interface GoogleMapsMap {
  setCenter(center: { lat: number; lng: number }): void;
  setZoom(zoom: number): void;
  addListener(event: string, handler: (e: any) => void): void;
}

interface GoogleMapsGeocoder {
  geocode(
    request: { address: string; region: string },
    callback: (
      results: Array<{
        geometry: { location: GoogleMapsLatLng };
      }>,
      status: string
    ) => void
  ): void;
}

interface GoogleMapsMarker {
  setMap(map: GoogleMapsMap | null): void;
  position: GoogleMapsLatLng;
  addListener(event: string, handler: () => void): void;
}

interface GoogleMapsInfoWindow {
  addListener(event: string, handler: () => void): void;
  open(options: { map: GoogleMapsMap; shouldFocus: boolean }): void;
  setMap(map: GoogleMapsMap | null): void;
}

interface GoogleMapsSize {
  new (width: number, height: number): GoogleMapsSize;
}

interface GoogleMaps {
  maps: {
    Map: new (
      element: HTMLElement,
      options: GoogleMapsMapOptions
    ) => GoogleMapsMap;
    Marker: new (options: {
      position: { lat: number; lng: number };
      draggable: boolean;
      map: GoogleMapsMap;
    }) => GoogleMapsMarker;
    Geocoder: new () => GoogleMapsGeocoder;
    InfoWindow: new (options: {
      content: string;
      position: { lat: number; lng: number };
      pixelOffset: GoogleMapsSize;
    }) => GoogleMapsInfoWindow;
    Size: GoogleMapsSize;
  };
}

declare global {
  interface Window {
    google?: GoogleMaps;
  }
  const google: GoogleMaps;
}

interface Location {
  lat: number;
  lng: number;
}

interface GoogleMapProps {
  address: string;
  onLocationSelected: (location: Location | null) => void;
}

let markers: GoogleMapsMarker[] = [];
let infoWindows: GoogleMapsInfoWindow[] = [];
let placeId: string | null = null;
let map: GoogleMapsMap | null = null;
let geocoder: GoogleMapsGeocoder | null = null;

const defaultCenter: Location = {
  lat: 13.7649084,
  lng: 100.5360959
}; //Victory Monument

const GoogleMap = ({ address, onLocationSelected }: GoogleMapProps) => {
  const { t } = useTranslation('pages/post-form');
  const searchMode = address.indexOf('__search') !== -1;

  const initMapFromAddressText = () => {
    if (!window.google) return;
    if (!geocoder) {
      geocoder = new window.google.maps.Geocoder();
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

  const initializeMap = (options: GoogleMapsMapOptions) => {
    if (!window.google) return;

    const mapOptions: GoogleMapsMapOptions = {
      zoom: 15,
      minZoom: 10,
      clickableIcons: false,
      gestureHandling: 'greedy',
      streetViewControl: false,
      ...options
    };

    if (map && mapOptions.center) {
      map.setCenter(mapOptions.center);
      if (mapOptions.zoom) {
        map.setZoom(mapOptions.zoom);
      }
    } else {
      const mapElement = document.getElementById('googleMap');
      if (!mapElement) return;

      map = new window.google.maps.Map(mapElement, mapOptions);

      map.addListener('click', (e: { latLng: GoogleMapsLatLng }) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        createMarker(map!, { lat, lng }, true);
      });
    }
    if (mapOptions.center) {
      createMarker(map!, mapOptions.center, searchMode);
    }
  };

  const createInfoWindow = (
    map: GoogleMapsMap,
    position: Location,
    isFirstMarker: boolean
  ) => {
    if (!window.google) return;

    const contentText = isFirstMarker
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
      pixelOffset: new window.google.maps.Size(0, -42)
    });

    infoWindow.addListener('domready', () => {
      // InfoWindow ready
    });

    infoWindows.push(infoWindow);
    infoWindow.open({ map, shouldFocus: false });
  };

  const createMarker = (
    map: GoogleMapsMap,
    position: Location,
    pin = false
  ) => {
    if (!window.google) return;

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
