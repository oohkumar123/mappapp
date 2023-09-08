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
        locationsList: (state) => {
            return state.locations;
        },
        addressesList: (state) => {
            return state.addresses;
        },
        statsList: (state) => {
            return state.stats;
        },
    },
    mutations: {
        addAddress:  (state, address) => {
            state.addresses.push(address);
        },
        addPlaceId:  (state, placeId) => {
            state.placeIds.push(placeId);
            //console.info('%cstate.placeIds: %o', 'color: red;font-size:12px', state.placeIds);
        },
        updatePlaceIds:  (state, placeIds) => {
            //console.info('%cLocation: %o', 'color: green;font-size:12px', 'updatePlaceIds');
            //console.info('%cplaceIds: %o', 'color: red;font-size:12px', placeIds);
            state.placeIds = placeIds;
            //console.info('%cstate.placeIds: %o', 'color: red;font-size:12px', state.placeIds);
        }
    },
    modules: {},
    actions: {
        processMap: (context) => {
            //console.info('%cLocation: %o', 'color: green;font-size:12px', 'processMap');
            let list = context.state.placeIds;
            //console.info('%clist: %o', 'color: red;font-size:12px', list);

            let prev; // leave undefined
            let cur=[];

            context.state.loader.importLibrary('maps').then(async () => {
                //let list = context.state.placeIds;
                //console.info('%clist: %o', 'color: red;font-size:12px', list);
                
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
                                    distanceText:response.rows[0].elements[0].distance.text, 
                                    durationText:response.rows[0].elements[0].duration.text
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

