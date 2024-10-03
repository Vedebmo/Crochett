<template>
    <div class="item">
        <img src="https://zeromotorcycles.com/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fzero-cms-disco%2F9ddb733e-225b-4bf7-bf41-72d36c6f4272_S_MY24.2.jpg%3Fauto%3Dcompress%2Cformat&w=3840&q=75" alt="Prodcuto del carrito">
        <div>
            <h1>{{ name }}</h1>
            <p style="text-align: center;">{{ price$ }}$ ó {{ priceBs }}Bs</p>
        </div>
    </div>
</template>

<script>
    export default{
        name: "Item",
        props: ['name', 'price$', 'priceBs']
    }
</script>

<style scoped>
    .item{
        display: flex;
        align-items: center;
        max-height: 20vh;
        margin: 10px 0;
    }

    .item *{
        margin: 10px;
        font-family: "Belleza";
    }

    .item div{
        width: 40%;
    }

    img {
        width: 100%;
        max-height: 20vh;
        max-width: 50vw;
    }
</style>