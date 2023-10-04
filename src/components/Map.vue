<template>
    <div id="map" ref="map"></div>
    <SearchBar @sendAddress="searchAddress"></SearchBar>

</template>
<script>
import { Loader } from "@googlemaps/js-api-loader";
import SearchBar from './SearchBar.vue';

export default {
    components: {
        SearchBar
    },
    data() {
        return {
            address: '420 Monte Vista Avenue, Mill Valley 94941',
            mapp:{},
            markers:{},
            lines:[],
            apiKey: "AIzaSyDlLrLnR2kTGVYhjtbu9ylIUm7eVTin2bk",
            count: 1
            
        }
    },
    async mounted() {
        this.loadMap();            
    },
    watch: {
        triggerVar (newCount, oldCount) {
            let keys = Object.keys(this.lines);
            keys.forEach(((k)=>{
                this.lines[k].delete();
            }));
            this.addLinesList ();
        },
        triggerAll (newCount, oldCount) {
            let keys = Object.keys(this.lines);
            keys.forEach(((k)=>{
                this.lines[k].delete();
            }));
            this.lines = [];

            let keys2 = Object.keys(this.markers);
            keys2.forEach(((m)=>{
                this.markers[m].delete();
            }));
            this.markers = [];
        }

    },
    computed: {
        triggerVar () {
            return this.$store.getters.getTriggerVar;
        },
        triggerAll() {
            return this.$store.getters.getTriggerVarDelete;
        }
    },
    methods: {
        
        async loadMap() {
            const loader = new Loader({apiKey: this.apiKey, version: "weekly"});      
            let {Map} = await loader.importLibrary('maps');
            this.map = new Map(this.$refs.map, {
                center: { lat: 37.9107347, lng: -122.5640172 },
                zoom: 14,
                mapId: "4504f8b37365c3d0",
            });
        
            this.map.addListener("click", async (event) => {  
                const geocoder = new window.google.maps.Geocoder()       
                const response = await geocoder.geocode({ location: event.latLng });
                this.addPlace(response);
            });
        },
        
        async searchAddress(address) {
            const geocoder = new window.google.maps.Geocoder()       
            const response = await geocoder.geocode({ address });
            this.addPlace(response);
        },       
        
        addPlace (response) {
            let {place_id, geometry:{location:location}, formatted_address} = response.results[0];
            this.$store.commit('addPlace', {
                place_id,
                location,
                formatted_address,
            });
            this.addMarkers (place_id, location, formatted_address);
            this.addLines(place_id, location);

        },

        addMarkers (place_id, location, formatted_address) {
            let marker = new google.maps.Marker({ position:location, label:{text:formatted_address, className:'address-marker', map: this.map}});
            marker.setMap(this.map);
            this.markers[place_id] = {delete:()=>marker.setMap(null)}
        },
        
        async addLines (place_id, destination) {
            let places = this.$store.getters.getPlaces;
            let origin = places.at(-2);
            if (origin) {
                let lineColors = ['red','green','blue','yellow','orange','pink'];
                let colorCount = Object.values(this.lines).length;
                
                let directionsService = new google.maps.DirectionsService();
                let directionsRenderer = new google.maps.DirectionsRenderer({
                    map: this.map,
                    polylineOptions: {
                        strokeColor: lineColors[colorCount],
                        strokeWeight: 5,
                        strokeOpacity: 0.7
                    }
                });
                let request = {origin:origin.location,destination,travelMode: 'DRIVING'};
                directionsService.route(request, (result, status) => {
                    if (status == 'OK') {
                        directionsRenderer.setDirections(result);
                        this.lines[place_id] = {delete:()=>{directionsRenderer.setMap(null);directionsRenderer = null;}}
                    }
                }) 
            }
        },
        addLinesList () {
            let places = this.$store.getters.getPlaces;
            
            for (let i = 1; i < places.length; i++) {
                let origin = places[i-1];
                let destination = places[i];
                let lineColors = ['red','green','blue','yellow','orange','pink'];
                let colorCount = i;
                
                let directionsService = new google.maps.DirectionsService();
                let directionsRenderer = new google.maps.DirectionsRenderer({
                    map: this.map,
                    polylineOptions: {
                        strokeColor: lineColors[colorCount],
                        strokeWeight: 5,
                        strokeOpacity: 0.7
                    }
                });
                let request = {
                    origin:origin.location,
                    destination:destination.location,
                    travelMode: 'DRIVING'
                };
                directionsService.route(request, (result, status) => {
                    if (status == 'OK') {
                        directionsRenderer.setDirections(result);
                        this.lines[destination.place_id] = {delete:()=>{directionsRenderer.setMap(null);directionsRenderer = null;}}
                    }
                }) 
            }
        },
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
