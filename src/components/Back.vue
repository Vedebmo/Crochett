<template>
    <span class="icon-arrow-left" @click.prevent="goBack"></span>
</template>

<style scoped>
    .icon-arrow-left{
        color: black;
        position: relative;
        top: 10px;
        left: 10px;
        font-size: xx-large;
        text-decoration: none;
    }

    a{
        color: black;
        text-decoration: none;
    }
</style>

<script>
    export default {
        name: "Back",
    methods: {
      goBack() {
        this.$router.go(-1);
      }
    }
}
</script>