<template>
    <div id="map" ref="map"></div>
</template>
<script>
import { Loader } from "@googlemaps/js-api-loader";
export default {
    data() {
        return {
            address: '420 Monte Vista Avenue, Mill Valley 94941',
            mapp:{},
            markers:{},
            lines:[],
            loader: new Loader({apiKey: "AIzaSyDlLrLnR2kTGVYhjtbu9ylIUm7eVTin2bk",version: "weekly"}),

        }
    },

    async mounted() {
        this.loadMap();            
    },

    methods: {
        
        async loadMap() {
            let {Map} = await this.loader.importLibrary('maps');
            this.map = new Map(this.$refs.map, {
                center: { lat: 37.9107347, lng: -122.5640172 },
                zoom: 14,
                mapId: "4504f8b37365c3d0",
            });
        
            this.map.addListener("click", async (event) => {         
                const geocoder = new window.google.maps.Geocoder();
                let response = await geocoder.geocode({ location: event.latLng })
                //console.info('%cresults: %o', 'color: red;font-size:12px', response);
                this.$store.commit('addPlaceId', {
                    id: response.results[0].place_id,
                    location: response.results[0].geometry.location,
                    formatted_address: response.results[0].formatted_address,
                });
                this.addMarkers ();
                //this.addLines();
            });
        },
        
        addMarkers () {
            let places = this.$store.getters.getPlaceIds;

            places.forEach(place => {
                let marker = new google.maps.Marker({ position:place.location, label:{text:place.formatted_address, className:'address-marker', map: this.map}});
                marker.setMap(this.map);
                this.markers[place.id] = {marker, delete:()=>marker.setMap(null)}
            });
        },
        
        // async addLines () {
        //     let addresses = this.$store.getters.addressesList;
        //     let lineColors = ['red','green','blue','yellow','orange','pink']

        //     setTimeout(async ()=>{ 
        //         for (let i = 0; i < addresses.length; i++) {
        //             if (addresses[i].stats){
        //                 let origin = addresses[i].stats.origin;
        //                 let destination = addresses[i].stats.destination;
                        
        //                 const service = new google.maps.DistanceMatrixService();
        //                 await service.getDistanceMatrix({
        //                     origins: [origin],
        //                     destinations: [destination],
        //                     travelMode: 'DRIVING',
        //                     unitSystem: google.maps.UnitSystem.IMPERIAL,
        //                 });
        //                 let directionsService = new google.maps.DirectionsService();
        //                 let directionsRenderer = new google.maps.DirectionsRenderer({
        //                     map: this.mapp,
        //                     polylineOptions: {
        //                         strokeColor: lineColors[i-1],
        //                         strokeWeight: 5,
        //                         strokeOpacity: 0.7
        //                     }
        //                 });
        //                 let request = {origin,destination,travelMode: 'DRIVING'};
        //                 directionsService.route(request, (result, status) => {
        //                     if (status == 'OK') {
        //                         directionsRenderer.setDirections(result);
        //                         this.lines.push(()=>{
        //                             directionsRenderer.setMap(null);
        //                             directionsRenderer = null;
        //                         })
        //                     }
        //                 }) 
        //             }
        //         }
        //     }, 1000);
        // },
    },
 }
</script>

<style lang="scss">
    #map {
        width: 100%;
        height: 600px;
        background-color: $colorD;

        .address-marker {
            width: 150px;
            background-color: $colorD;
            border-radius: 8px;
            border:2px solid $colorA;
            color: $colorA;
            font-size: 14px;
            padding: 3px 5px;
            position: relative;
            white-space:normal;
            &::after {
                content: "";
                position: absolute;
                left: 50%;
                top: 100%;
                transform: translate(-50%, 0);
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 8px solid $colorA;
            }

        }
        [class$=api-load-alpha-banner] {
            display: none;
        }

    }
    #search-bar {
        background-color: green;
        width: 100%;
        padding: 10px 0;
        label {
            color:white;
        }
        input {
            width:400px;
            height: 30px;
            border: 0;
            border-radius: 2px;

        }
        button {
            width:30px;
            height:30px;
            border: 0;
            border-radius: 2px;
            margin-left:2px;
        }
        p {color:white}
    }

</style>
