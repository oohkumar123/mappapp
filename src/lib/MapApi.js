import { Loader } from "@googlemaps/js-api-loader";
import store from '../store'
export default class MapApi {
    constructor() {
        this.map = {};
        this.loader = new Loader({
            apiKey: "AIzaSyDlLrLnR2kTGVYhjtbu9ylIUm7eVTin2bk",
            version: "weekly"
        });
        this.loader.importLibrary('maps').then(async ({Map}) => { 
            this.map = new Map(document.getElementById("map"), {
                center: { lat: 37.9107347, lng: -122.5640172 },
                zoom: 14,
                mapId: "4504f8b37365c3d0",
            });
            this.addClick();
        });
    }
    
    addClick () {
        this.map.addListener("click", async (event) => {         
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: event.latLng }, (results, status) => {
                let marker = this.addmarker (this.map, event.latLng, results[0].formatted_address);
                store.dispatch('addPlaceId', {placeId: results[0].place_id, marker});
            });
        });
    }

    async searchForAddress (address) {
        const geocoder = new window.google.maps.Geocoder();
        let response = await geocoder.geocode({ address })
        let marker = this.addmarker (this.map, response.results[0].geometry.location, response.results[0].formatted_address);
        return {placeId: response.results[0].place_id, marker};
    }
    
    async addmarker (map, position, formatted_address) {
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const newMarker = document.createElement("div");
        newMarker.className = "address-marker";
        newMarker.textContent = formatted_address;
        return new AdvancedMarkerElement({ map, position, content: newMarker });
    }

  }