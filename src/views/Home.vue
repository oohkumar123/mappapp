<template>
    <div class="wrapper">
        <Map></Map>
        <Destinations></Destinations>
    </div>
</template>

<script>
import Map from '../components/Map.vue';
import Destinations from '../components/Destinations.vue';

export default {
    components: {
        Map,
        Destinations
    }
}

</script>

<style lang="scss">
.wrapper {
    width: 80%;
    padding:20px;;
    background-color: $colorA;
    margin:auto;
    margin-bottom: 20px;

}
</style>
