<template>
    <div class="item">
        <img :src="url" alt="Prodcuto del carrito">
        <div>
            <h1 style="text-align: center; font-size: 1.6rem">{{ name }} - {{cart.productsCart[id][0]}} {{ `Unidad(es)` }}</h1>
            <p style="text-align: center;">{{ price$ }}$ ó {{ priceBs }}Bs</p>
            <div class="row">
                <span class="icon-bin" @click="cart.deleteCart(id)"></span>
                <small>Remover del carrito</small>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { Cart } from "@/Stores/Cart.js";
    const cart = Cart()
</script>

<script>
    export default{
        name: "Item",
        props: ['name', 'price$', 'priceBs', 'id', 'url']
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
        object-fit: contain;
        width: 100%;
        max-height: 20vh;
        max-width: 35vw;
    }

    .icon-bin{
        color: red;
        cursor: pointer;
        text-align: center
    }

    small{
        text-wrap: nowrap
    }
</style>