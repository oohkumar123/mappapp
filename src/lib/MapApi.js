import { Loader } from "@googlemaps/js-api-loader";

export default class MapApi {
    constructor(address) {
        this.map = {}
        this.loader = new Loader({
            apiKey: "AIzaSyDlLrLnR2kTGVYhjtbu9ylIUm7eVTin2bk",
            version: "weekly"
        });
        this.loader.importLibrary('maps').then(async ({Map}) => { // Study this
            this.map = new Map(document.getElementById("map"), {
                center: { lat: 37.9107347, lng: -122.5640172 },
                zoom: 14,
                mapId: "4504f8b37365c3d0",
            });
        });
    }
    
    async searchForAddress (address) {
        let response;
        let geocoder = new window.google.maps.Geocoder();
        response = await geocoder.geocode({ address });
        let marker = await this.addmarker (this.map, response.results[0].geometry.location, response.results[0].formatted_address);
        //return {placeId: response.results[0].place_id, marker:123};
    }
    
    async addmarker (mapp, position, formatted_address) {
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker"); // can this be moved to loader?
        const newMarker = document.createElement("div");
        newMarker.className = "address-marker";
        newMarker.textContent = formatted_address;
        return new AdvancedMarkerElement({ map:this.map, position, content: newMarker });
    }

  }