import { createStore } from "vuex";
import { Loader } from "@googlemaps/js-api-loader";

export default createStore({
    state: {
        placeIds: [],
        placeIdsUpdated: [],
        addresses: [],
        previous: 0,
        loader: new Loader({apiKey: "AIzaSyDlLrLnR2kTGVYhjtbu9ylIUm7eVTin2bk",version: "weekly"}),
        map:[]
    },
    getters: {
        addressesList: (state) => {
            return state.addresses;
        },
    },
    mutations: {
    },
    modules: {},
    actions: {
        deleteAll: async (context) => {
            context.state.placeIds.forEach(async (m) => {
                let t = await m.marker;
                t.setMap(null);
            })
            context.state.placeIds = [];
            context.state.addresses = [];
            console.info('%cmap: %o', 'color: red;font-size:12px', context.state.map);
            let directionsRenderer = new google.maps.DirectionsRenderer();
            console.info('%cdirectionsRenderer: %o', 'color: red;font-size:12px', directionsRenderer);
            directionsRenderer.setMap();
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
        addPlaceId:  (context, placeObj) => {
            context.state.placeIds.push(placeObj);
            context.dispatch('processMap');
        },
        processMap: (context) => {
            let list = context.state.placeIds;
            let prev; // leave undefined
            let cur=[];
            let map = context.state.map;
            let lineColors = ['red','green','blue','yellow','orange','pink']

            context.state.loader.importLibrary('maps').then(async () => {
                
                for (let i = 0; i < list.length; i++) {
                    let response = await new google.maps.Geocoder().geocode({placeId: list[i].placeId});
                    cur = response.results[0];

                    if (prev) {
                        const origin = new google.maps.LatLng(prev.geometry.location);
                        //console.info('%corigin: %o', 'color: red;font-size:12px', origin);
                        const destination = new google.maps.LatLng(cur.geometry.location);
                        const service = new google.maps.DistanceMatrixService();
                        
                        let response = await service.getDistanceMatrix({
                            origins: [origin],
                            destinations: [destination],
                            travelMode: 'DRIVING',
                            unitSystem: google.maps.UnitSystem.IMPERIAL,
                        });
                        
                        if (response.rows[0].elements[0].status == 'OK') {
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
                            }
                            var directionsService = new google.maps.DirectionsService();
                            var directionsRenderer = new google.maps.DirectionsRenderer({
                                map: map,
                                polylineOptions: {
                                    strokeColor: lineColors[i-1],
                                    strokeWeight: 5,
                                    strokeOpacity: 0.7
                                }
                            });
                            var request = {origin: origin,destination: destination,travelMode: 'DRIVING'};
                            directionsService.route(request, function(result, status) {
                                if (status == 'OK') {directionsRenderer.setDirections(result);}
                            });
        
                            prev = cur;
                        }
                    } else {
                        context.state.addresses[i] = {
                            placeId:cur.place_id,
                            address:cur.formatted_address, 
                            latlng:cur.geometry.location
                        };
                        prev = cur;
                    }
                }
            })
        },
    },
});

