<template>
    <div id="map"></div>
</template>
<script>
export default {
    data() {
        return {
            markerList: [],
            map: {},
        }
    },
    mounted() {
    },
    methods: {}
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
</style>
