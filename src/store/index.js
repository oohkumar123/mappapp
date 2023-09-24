import { createStore } from "vuex";
import { Loader } from "@googlemaps/js-api-loader";

export default createStore({
    state: {
        placeIds: [],
        addresses: [],
        loader: new Loader({apiKey: "AIzaSyDlLrLnR2kTGVYhjtbu9ylIUm7eVTin2bk",version: "weekly"}),
        map:[],
        mapRef:[]
    },
    getters: {
        addressesList: (state) => {
            return state.addresses;
        },
        getMap: (state) => {
            return state.map;
        },
    },
    mutations: {
        commitMap (state, map) {
            state.map = map;
        },
        storeMapRef (state, payload) {
            state.mapRef = payload;
        },
    },
    modules: {},
    actions: {
        
        async loadMap (context) {
            let {Map} = await context.state.loader.importLibrary('maps');
            let map = new Map(context.state.mapRef, {
                center: { lat: 37.9107347, lng: -122.5640172 },
                zoom: 14,
                mapId: "4504f8b37365c3d0",
            });
            context.commit('commitMap', map);
        },
        
        addPlaceId:  (context, placeObj) => {
            context.state.placeIds.push(placeObj);
            context.dispatch('processMap');
        },
        
        deleteAll:  (context) => {
            context.state.placeIds.forEach( (placeId) => {
                console.info('%cplaceId: %o', 'color: red;font-size:12px', placeId);
            })
            context.state.addresses.forEach( (address) => {
                console.info('%caddress: %o', 'color: red;font-size:12px', address);
                address.marker();
            });
            context.dispatch('loadMap');
            context.state.placeIds = [];
            context.state.addresses = [];
        },
        
        deleteLoc: async (context, placeId) => {
            let t = await context.state.placeIds[placeId].marker;
            t.setMap(null);

            let temp = context.state.placeIds.filter((item, index) => index!==placeId);
            context.state.placeIds = temp;
            context.state.addresses = [];
            context.dispatch('processMap');
        },
        moveUp(context, index) {
            let temp = context.state.placeIds[index];
            context.state.placeIds[index] = context.state.placeIds[index-1];
            context.state.placeIds[index-1] = temp;
            context.dispatch('processMap');
        },
        moveDown(context, index) {
            let temp = context.state.placeIds[index];
            context.state.placeIds[index] = context.state.placeIds[index+1];
            context.state.placeIds[index+1] = temp;
            context.dispatch('processMap');
        },
        processMap: async (context) => {
            let list = context.state.placeIds;
            let prev; // leave undefined
            let cur=[];
            let map = context.state.map;
            let lineColors = ['red','green','blue','yellow','orange','pink']

            for (let i = 0; i < list.length; i++) {
                let response = await new google.maps.Geocoder().geocode({placeId: list[i].placeId});
                cur = response.results[0];

                let marker = new google.maps.Marker({ position:cur.geometry.location, label:{text:cur.formatted_address, className:'address-marker', map}});
                marker.setMap(map);
        
                if (prev) {
                    const origin = new google.maps.LatLng(prev.geometry.location);
                    const destination = new google.maps.LatLng(cur.geometry.location);
                    const service = new google.maps.DistanceMatrixService();
                    
                    let response = await service.getDistanceMatrix({
                        origins: [origin],
                        destinations: [destination],
                        travelMode: 'DRIVING',
                        unitSystem: google.maps.UnitSystem.IMPERIAL,
                    });
                    let directionsService = new google.maps.DirectionsService();
                    let directionsRenderer = new google.maps.DirectionsRenderer({
                        map: context.state.map,
                        polylineOptions: {
                            strokeColor: lineColors[i-1],
                            strokeWeight: 5,
                            strokeOpacity: 0.7
                        }
                    });
                
                    if (response.rows[0].elements[0].status == 'OK') {
                        let request = {origin: origin,destination: destination,travelMode: 'DRIVING'};
                        directionsService.route(request, function(result, status) {
                            if (status == 'OK') {
                                directionsRenderer.setDirections(result);
                                context.state.addresses[i] = {
                                    placeId:cur.place_id,
                                    address:cur.formatted_address, 
                                    latlng:cur.geometry.location,
                                    stats:{
                                        distanceText:       response.rows[0].elements[0].distance.text, 
                                        durationText:       response.rows[0].elements[0].duration.text,
                                        distanceMeters:     response.rows[0].elements[0].distance.value, 
                                        durationSeconds:    response.rows[0].elements[0].duration.value,
                                        origin,
                                        destination,
                                        backgroundColor: lineColors[i-1],
                                    },
                                    marker:()=>{console.info('%c%o', 'color: red;font-size:12px', 'Here I am 2'); marker.set(null);}
                                }
                            }
                        });

    
                        prev = cur;
                    }
                } else {
                    context.state.addresses[i] = {
                        placeId:cur.place_id,
                        address:cur.formatted_address, 
                        latlng:cur.geometry.location,
                        marker:()=>{console.info('%c%o', 'color: red;font-size:12px', 'Here I am 1'); marker.set(null);}
                    };
                    prev = cur;
                }
            }
        },
    },
});

