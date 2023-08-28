import { createStore } from "vuex";

export default createStore({
    state: {
        locations: [],
    },
    getters: {
        locationsList: (state) => {
            return state.locations;
        },
    },

    mutations: {
        updateArray(state, newArray) {
            state.locations.push(newArray);
            console.info('%cstate.locations: %o', 'color: blue;font-size:12px', state.locations);
        },
    },
    actions: {},
    modules: {},
});
