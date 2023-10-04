import { createStore } from "vuex";

export default createStore({
    state: {
        places: [],
        myTriggerVar:0,
        myTriggerVarDelete:0
    },
    getters: {
        getPlaces: (state) => {
            return state.places;
        },
        getTriggerVar: (state) => {
            return state.myTriggerVar;
        },
        getTriggerVarDelete: (state) => {
            return state.myTriggerVarDelete;
        },
    },
    mutations: {
        deleteAll:  (state) => {
            state.places = [];
            state.myTriggerVarDelete++
        },
        addPlace:  (state, payload) => {
            state.places.push(payload);
        },
        moveUp(state, index) {
            let temp = state.places[index];
            state.places[index] = state.places[index-1];
            state.places[index-1] = temp;
            state.myTriggerVar++
        },
        moveDown(state, index) {
            let temp = state.places[index];
            state.places[index] = state.places[index+1];
            state.places[index+1] = temp;
            state.myTriggerVar++

        }
    }
});

