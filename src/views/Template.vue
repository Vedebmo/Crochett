<script setup>
    import Back  from "@/components/Back.vue";
</script>

<template>
    <Back></Back>
    <div class="row">
      <h2 style="text-align: center; text-wrap: nowrap;">{{$route.params.class}}</h2>
      <hr>
    </div>

    <div class="product-parent">
        <div class="products">
            <router-link class="product-container link" :to="{path: '/'}">
                <div class="product-container">
                    <img src="https://picsum.photos/200/300" alt="product image">
                    <br>
                    <h4>Producto</h4>
                    <p>Precio: 8$ / 348 Bs</p>
                </div>
            </router-link>
            <router-link class="product-container link" :to="{path: '/'}">
                <div class="product-container">
                    <img src="https://picsum.photos/200/300" alt="">
                    <br>
                    <h4>Producto</h4>
                    <p>Precio: 8$ / 348 Bs</p>
                </div>
            </router-link>
            <router-link class="product-container link" :to="{path: '/'}">
                <div class="product-container">
                    <img src="https://picsum.photos/200/300" alt="">
                    <br>
                    <h4>Producto</h4>
                    <p>Precio: 8$ / 348 Bs</p>
                </div>
            </router-link>
            <router-link class="product-container link" :to="{path: '/'}">
                <div class="product-container">
                    <img src="https://picsum.photos/200/300" alt="">
                    <br>
                    <h4>Producto</h4>
                    <p>Precio: 8$ / 348 Bs</p>
                </div>
            </router-link>
            <router-link class="product-container link" :to="{path: '/'}">
                <div class="product-container">
                    <img src="https://picsum.photos/200/300" alt="">
                    <br>
                    <h4>Producto</h4>
                    <p>Precio: 8$ / 348 Bs</p>
                </div>
            </router-link>
            <router-link class="product-container link" :to="{path: '/'}">
                <div class="product-container">
                    <img src="https://picsum.photos/200/300" alt="">
                    <br>
                    <h4>Producto</h4>
                    <p>Precio: 8$ / 348 Bs</p>
                </div>
            </router-link>
            <router-link class="product-container link" :to="{path: '/'}">
                <div class="product-container">
                    <img src="https://picsum.photos/200/300" alt="">
                    <br>
                    <h4>Producto</h4>
                    <p>Precio: 8$ / 348 Bs</p>
                </div>
            </router-link>
            <router-link class="product-container link" :to="{path: '/'}">
                <div class="product-container">
                    <img src="https://picsum.photos/200/300" alt="">
                    <br>
                    <h4>Producto</h4>
                    <p>Precio: 8$ / 348 Bs</p>
                </div>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
    .products{
        position: relative;
        margin: auto;
        width: 90vw;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: center;
    }

    .product-parent{
        display: grid;
        place-items: center;
        height: 90vh;
    }

    .product-container{
        margin: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        transition: background ease 1s;
        cursor: pointer;
    }

    .link{
        color: black;
        text-decoration: none;
        transition: background ease 1s color ease 1s;
        width: -webkit-fill-available;
    }

    .product-container img{
        height: 70%;
        width: 100%;
    }

    .product-container *{
        font-family: "Arimo";
    }

    .link:hover{
        background-color: #cda349;
        color: white;
    }

    .product-container h4{
        font-weight: 500;
    }

    @media screen and (min-width: 601px) {

        .products{
            width: 80vw;
        }

        .product-container{
            height: 35vh;
            flex-basis: 16vw;
        }

        .link{
            width: initial;
        }
    }
</style>