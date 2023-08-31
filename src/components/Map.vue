<template>
    <div id="map"></div>
</template>
<script>
import { Loader } from "@googlemaps/js-api-loader";
export default {
    data() {
        return {
            markerList: [],
            map: {},
        }
    },
    mounted() {
        this.initMap();
    },
    methods: {
        initMap() {

            const loader = new Loader({
                apiKey: "AIzaSyDlLrLnR2kTGVYhjtbu9ylIUm7eVTin2bk",
                version: "weekly"
            });

            loader.importLibrary('maps').then(async ({Map}) => { // Study this
                const map = new Map(document.getElementById("map"), {
                center: { lat: 37.4239163, lng: -122.0947209 },
                    zoom: 14,
                    mapId: "4504f8b37365c3d0",
                });
                
                map.addListener("click", async (event) => {
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode({ location: event.latLng }, (results, status) => {
                        this.$store.commit('addPlaceId', results[0].place_id);            
                        this.$store.dispatch("processMap");
                        this.addmarker (map, event.latLng, results[0].formatted_address);
                    });
                });
            });
        },
        
        async addmarker (map, position, formatted_address) {
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker"); // can this be moved to loader?
            const newMarker = document.createElement("div");
            newMarker.className = "address-marker";
            newMarker.textContent = formatted_address;
            new AdvancedMarkerElement({ map, position, content: newMarker });
        }
    }
}
</script>

<style lang="scss">
    #map {
        width: 100%;
        height: 600px;
        background-color: blue;

        .address-marker {
            width: 150px;
            background-color: #4285F4;
            border-radius: 8px;
            color: #FFFFFF;
            font-size: 14px;
            padding: 3px 5px;
            position: relative;
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
                border-top: 8px solid #4285F4;
            }

        }
        [class$=api-load-alpha-banner] {
            display: none;
        }

    }
</style>
