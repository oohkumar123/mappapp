import { createStore } from "vuex";

export default createStore({
    state: {
        placeIds: [],
    },
    getters: {
        getPlaceIds: (state) => {
            return state.placeIds;
        },

    },
    mutations: {
        addPlaceId:  (state, payload) => {
            state.placeIds.push(payload);
            //console.info('%c: %o', 'color: red;font-size:12px', state.placeIds);
        },

    },
    modules: {},
    actions: {       
        
        // addPlaceId:  (context, placeObj) => {
        //     context.state.placeIds.push(placeObj);
        //     console.info('%cplaceObj: %o', 'color: red;font-size:12px', placeObj);
        //     //context.dispatch('processMap');
        // },
        
        // clearAll () {
        //     this.markers.forEach((m)=>m());
        //     this.lines.forEach((l)=>l());
        //     this.$store.dispatch('deleteAll');
        // },

        // deleteAll:  (context) => {
        //     context.state.placeIds = [];
        //     context.state.addresses = [];
        // },
        
        // deleteLoc: async (context, placeId) => {
        //     let t = await context.state.placeIds[placeId].marker;
        //     t.setMap(null);

        //     let temp = context.state.placeIds.filter((item, index) => index!==placeId);
        //     context.state.placeIds = temp;
        //     context.state.addresses = [];
        //     context.dispatch('processMap');
        // },
        // moveUp(context, index) {
        //     let temp = context.state.placeIds[index];
        //     context.state.placeIds[index] = context.state.placeIds[index-1];
        //     context.state.placeIds[index-1] = temp;
        //     context.dispatch('processMap');
        // },
        // moveDown(context, index) {
        //     let temp = context.state.placeIds[index];
        //     context.state.placeIds[index] = context.state.placeIds[index+1];
        //     context.state.placeIds[index+1] = temp;
        //     context.dispatch('processMap');
        // },
        // processMap: async (context) => {
        //     let list = context.state.placeIds;
        //     let prev; // leave undefined
        //     let cur=[];
        //     let lineColors = ['red','green','blue','yellow','orange','pink']

        //     for (let i = 0; i < list.length; i++) {
        //         let response = await new google.maps.Geocoder().geocode({placeId: list[i].placeId});
        //         cur = response.results[0];

        //         if (prev) {
        //             const origin = new google.maps.LatLng(prev.geometry.location);
        //             const destination = new google.maps.LatLng(cur.geometry.location);
                    
        //             const service = new google.maps.DistanceMatrixService();
        //             let response = await service.getDistanceMatrix({
        //                 origins: [origin],
        //                 destinations: [destination],
        //                 travelMode: 'DRIVING',
        //                 unitSystem: google.maps.UnitSystem.IMPERIAL,
        //             });
                
        //             if (response.rows[0].elements[0].status == 'OK') {
        //                 context.state.addresses[i] = {
        //                     placeId:cur.place_id,
        //                     address:cur.formatted_address, 
        //                     latlng:cur.geometry.location,
        //                     stats:{
        //                         distanceText:       response.rows[0].elements[0].distance.text, 
        //                         durationText:       response.rows[0].elements[0].duration.text,
        //                         distanceMeters:     response.rows[0].elements[0].distance.value, 
        //                         durationSeconds:    response.rows[0].elements[0].duration.value,
        //                         origin,
        //                         destination,
        //                         backgroundColor: lineColors[i-1],
        //                     }
        //                 }
        //                 prev = cur;
        //             }
        //         } else {
        //             context.state.addresses[i] = {
        //                 placeId:cur.place_id,
        //                 address:cur.formatted_address, 
        //                 latlng:cur.geometry.location
        //             };
        //             prev = cur;
        //         }
        //     }
        //},
    },
});

