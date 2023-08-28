<template>
    <div id="map"></div>
</template>
<script>
import { Loader } from "@googlemaps/js-api-loader";
import { mapState, mapMutations } from 'vuex';
export default {
    data() {
        return {
            markerList: [],
            map: {}
        };
    },
    beforeCreate() {
        //console.log("beforeCreate has been called");
    },
    created() {},
    beforeMount() {},
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
                const { AdvancedMarkerElement } = await google.maps.importLibrary("marker"); // can this be moved to loader?
                const map = new Map(document.getElementById("map"), {
                center: { lat: 37.4239163, lng: -122.0947209 },
                    zoom: 14,
                    mapId: "4504f8b37365c3d0",
                });
                
                map.addListener("click", async (event) => {
                    let markerAddress = await this.getAddressDetails(event.latLng); 
                    const newMarker = document.createElement("div");
                    newMarker.className = "address-marker";
                    newMarker.textContent = markerAddress;
                    new AdvancedMarkerElement({ map, position: event.latLng, content: newMarker });
                });
            });
        },
        async getAddressDetails(location) {
            const geocoder = new google.maps.Geocoder();
            let formatted_address = '';

            await geocoder.geocode({ location: location }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results.length > 0) {
                        formatted_address = results[0].formatted_address;
                        this.updateMyArray(
                            {
                                placeId: results[0].place_id,
                                address: formatted_address
                            }
                        )
                    } else {
                        console.log('No results found for the provided location.');
                    }
                } else {
                    console.log('Geocoder failed due to:', status);
                }
            });
            return formatted_address;
        },
        ...mapMutations(['updateArray']),
        
        updateMyArray(newArray) {
            this.updateArray(newArray);
        },
    },
    computed: {
        ...mapState({
            newLocation: state => state.newLocation
        }),
    },
};
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
