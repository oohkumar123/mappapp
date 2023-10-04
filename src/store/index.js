import { createStore } from "vuex";

export default createStore({
    state: {
        places: [],
        triggerMove:0,
        triggerDeleteAll:0,
        triggerDeleteOne:0
    },
    getters: {
        getPlaces: (state) => {
            return state.places;
        },
        getMove: (state) => {
            return state.triggerMove;
        },
        getDeleteAll: (state) => {
            return state.triggerDeleteAll;
        },
        getDeleteOne: (state) => {
            return state.triggerDeleteOne;
        },
    },
    mutations: {
        deleteOne: (state, placeId) => {
            let temp = state.places.filter((item, index) => index!==placeId);
            state.places = temp;
            state.triggerDeleteOne++;
        },
        deleteAll:  (state) => {
            state.places = [];
            state.triggerDeleteAll++
        },
        moveUp(state, index) {
            let temp = state.places[index];
            state.places[index] = state.places[index-1];
            state.places[index-1] = temp;
            state.triggerMove++
        },
        moveDown(state, index) {
            let temp = state.places[index];
            state.places[index] = state.places[index+1];
            state.places[index+1] = temp;
            state.triggerMove++
        },
        addPlace:  (state, payload) => {
            state.places.push(payload);
        },
    }
});

