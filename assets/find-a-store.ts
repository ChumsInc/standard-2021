"use strict";

interface Window {
    initMap: () => void,
}

interface Customer {
    CustomerName: string,
    AddressLine1: string|null,
    AddressLine2: string|null,
    AddressLine3: string|null,
    City: string|null,
    State: string|null,
    CountryCode: string|null,
    latitude: number,
    longitude: number,
}
interface Results {
    list: Customer[],
    counter: number,
}

interface Elements {
    searchForm: HTMLFormElement|null,
    homeAddress: HTMLInputElement|null,
    range: HTMLSelectElement|null,
    posLat: HTMLInputElement,
    posLng: HTMLInputElement,
    searchMessage: HTMLDivElement,
    searchResults: HTMLDivElement,
    map: HTMLDivElement,
}

interface GMap {
    map: google.maps.Map|null,
    infoWindow: google.maps.InfoWindow|null,
    markers: google.maps.Marker[],
    bounds: google.maps.LatLngBounds|null,
}

(function () {
    const MILES_TO_METERS = 1609.344;

    const results:Results = {
        list: [],
        counter: 0,
    }

    const elements:Elements = {
        searchForm: document.querySelector('#searchform'),
        homeAddress: document.querySelector('#homeaddress'),
        range: document.querySelector('#range'),
        posLat: document.querySelector('#pos-lat'),
        posLng: document.querySelector('#pos-lng'),
        searchMessage: document.querySelector('#message'),
        searchResults: document.querySelector('#searchresults'),
        map: document.querySelector('#googlemap'),
    }

    let timer:number;


    const gMap:GMap = {
        map: null,
        infoWindow: null,
        markers: [],
        bounds: null,
    }

    function initMap() {
        gMap.map = new google.maps.Map(elements.map, {
            zoom: 10,
            center:  {lat: 37.1673108, lng: -113.2989828},
        });
        gMap.bounds = gMap.map.getBounds();
        // gMap.map.addListener('center_changed', onChangeCenter)
        gMap.infoWindow = new google.maps.InfoWindow({
            content: '',
            disableAutoPan: true,
        });
        updateMapResults();
    }

    // function onChangeCenter() {
    //     if (!gMap.map || !elements.posLat || !elements.posLng) {
    //         return;
    //     }
    //     window.clearTimeout(timer);
    //     timer = window.setTimeout(() => {
    //         const center = gMap.map.getCenter();
    //
    //         if (gMap.bounds && gMap.bounds.contains(center)) {
    //             return;
    //         }
    //         gMap.bounds = gMap.map.getBounds();
    //         elements.posLat.value = center.lat().toString();
    //         elements.posLng.value = center.lng().toString();
    //         searchLocationHandler(null).catch(err => console.log(err));
    //     }, 1000);
    // }

    function updateMapResults() {
        gMap.markers.forEach(marker => {
            marker.setMap(null);
        })
        elements.searchResults.innerText = '';
        gMap.markers = results.list.map((customer, index) => {
            const content = buildMarkerContent(customer)
            content.classList.toggle('customer-link--' + index);
            elements.searchResults.append(document.importNode(content, true));
            const marker = new google.maps.Marker({
                position: {lat: customer.latitude, lng: customer.longitude},
                map: gMap.map,
                title: customer.CustomerName,
            });
            marker.addListener('click', () => {
                gMap.infoWindow.setContent(content);
                gMap.infoWindow.open(gMap.map, marker);
            })
            return marker;
        });
    }

    function buildMarkerContent(customer:Customer):HTMLDivElement {
        const content = document.createElement('div');
        content.classList.toggle('customer-link');
        const customerName = document.createElement('div');
        customerName.classList.toggle('store-map__customer__name', true);
        customerName.innerText = customer.CustomerName;
        content.append(customerName);

        const address = document.createElement('address');
        const cityState = [customer.City, customer.State, customer.CountryCode].filter(val => !/^(US|USA)$/i.test(val)).join(', ');
        address.innerHTML = [customer.AddressLine1, customer.AddressLine2, customer.AddressLine3, cityState].filter(a => !!a).join('<br>')
        content.append(address);
        return content;
    }

    function listClickHandler(ev:MouseEvent) {
        if (!ev.target || !gMap.map) {
            return;
        }
        const link = (ev.target as HTMLElement).closest('.customer-link');
        const idList = /customer-link--(\d+)/.exec(link.className);
        if (!idList.length || !idList[1]) {
            return;
        }
        const id = Number(idList[1]);
        gMap.bounds = gMap.map.getBounds();
        gMap.map.setCenter(gMap.markers[id].getPosition());
        google.maps.event.trigger(gMap.markers[id], 'click')
    }

    async function getAddressLocation() {
        try {
            const address = elements.homeAddress.value;
            if (!address.trim()) {
                if (gMap.map) {
                    const location = gMap.map.getCenter();
                    elements.posLat.value = location.lat().toString();
                    elements.posLng.value = location.lng().toString();
                }
                return
            }
            const geo = new google.maps.Geocoder();
            const res = await geo.geocode({address});

            if (res.results && res.results.length) {
                const location = res.results[0].geometry.location;
                elements.posLat.value = location.lat().toString();
                elements.posLng.value = location.lng().toString();
                gMap.map.setCenter(location);
            } else {
                window.alert('Search result not found.');
                return Promise.reject(new Error('Search result not found'));
            }
        } catch(err:unknown) {
            if (err instanceof Error) {
                window.alert('Address Search error: ' + err.message);
                console.warn("getAddressLocation()", err.message);
                return Promise.reject(err);
            }
            console.warn("getAddressLocation()", err);
            return Promise.reject(new Error('Error in getAddressLocation()'));
        }
    }

    async function searchLocationHandler(ev?:SubmitEvent) {
        if (ev) {
            ev.preventDefault();
        }
        try {
            if (!elements.posLng.value || !elements.posLat.value) {
                await getAddressLocation();
            }
            elements.searchMessage.innerText = 'loading';
            elements.searchMessage.classList.toggle('d-none', false);
            elements.searchMessage.classList.toggle('alert', true);
            elements.searchMessage.classList.toggle('alert-info', true);
            const params = new URLSearchParams();
            params.set('action', 'search');
            params.set('lat', elements.posLat.value);
            params.set('lng', elements.posLng.value);
            params.set('range', elements.range.value);
            const url = 'https://intranet.chums.com/api/stores?' + params.toString();
            const res = await fetch(url);
            if (!res.ok) {
                return;
            }
            const json = await res.json();
            if (!json || !json.list) {
                return;
            }
            results.list = json.list;
            if (!results.list.length) {
                elements.searchMessage.innerText = 'No stores found in this location';
                elements.searchMessage.classList.toggle('alert-warning', true);
            } else {
                elements.searchMessage.classList.toggle('d-none', true);
            }
            if (gMap.map) {
                updateMapResults();
            }
        } catch(err) {
            if (err instanceof Error) {
                console.debug("searchLocationHandler()", err.message);
                return Promise.reject(err);
            }
            console.debug("searchLocationHandler()", err);
            return Promise.reject(new Error('Error in searchLocationHandler()'));
        }
    }


    window.initMap = initMap;
    searchLocationHandler(null).catch(err => console.log(err));
    elements.searchResults.addEventListener('click', listClickHandler);
    elements.searchForm.addEventListener('submit', searchLocationHandler);
    elements.homeAddress.addEventListener('input', () => {
        elements.posLng.value = '';
        elements.posLat.value = '';
    })
}());


