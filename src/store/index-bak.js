import { createStore } from "vuex";
import { Loader } from "@googlemaps/js-api-loader";

export default createStore({
    state: {
        placeIds: [],
        placeIdsUpdated: [],
        addresses: [],
        previous: 0,
        loader: new Loader({apiKey: "AIzaSyDlLrLnR2kTGVYhjtbu9ylIUm7eVTin2bk",version: "weekly"})
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
        addPlaceId:  (context, placeId) => {
            context.state.placeIds.push(placeId);
            context.dispatch('processMap');
        },
        processMap: (context) => {

            let prev; // leave undefined
            let cur=[];

            context.state.loader.importLibrary('maps').then(async () => {
                let list = context.state.placeIds;
                
                for (let i = 0; i < list.length; i++) {
                    let response = await new google.maps.Geocoder().geocode({placeId: list[i]});
                    cur = response.results[0];

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
                        
                        if (response.rows[0].elements[0].status == 'OK') {
                            context.state.addresses[i] = {
                                placeId:cur.place_id,
                                address:cur.formatted_address, 
                                latlng:cur.geometry.location,
                                stats:{
                                    distanceText:       response.rows[0].elements[0].distance.text, 
                                    durationText:       response.rows[0].elements[0].duration.text,
                                    distanceMeters:     response.rows[0].elements[0].distance.value, 
                                    durationSeconds:    response.rows[0].elements[0].duration.value
                                },
                            }
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

