<script setup>
    import { Cart } from "@/Stores/Cart.js";
    import Item from "@/components/Item.vue";
    import Button from "@/components/Button.vue";
    const cart = Cart()

    window.addEventListener('resize', () => {
      if(cart.showingCart){
        cart.toogleCart()
        cart.toogleCart()
      }
    })
</script>

<template>
    <div class="shop">
        <div class="parent">
            <fieldset>
                <legend>
                    <span @click='cart.toogleCart' style="color: red; cursor: pointer">X</span>
                </legend>
                <legend style="text-align:center; text-decoration: underline">
                    Tu Carrito:
                </legend>

                <Item :name="'Girasol'" :price$="8" :priceBs="348"></Item>
                <Item :name="'Perfume'" :price$="8" :priceBs="348"></Item>

                <div style="margin-top: auto">
                    <p style="text-align: center; font-size: 1.5rem;">
                        Total a pagar:
                        <br>
                        16$ ó 696Bs
                    </p>
                    <Button style="margin: 5% auto;"></Button>
                </div>
            </fieldset>
        </div>
    </div>
</template>

<script>
    export default{
        name: "ShopCart"
    }
</script>

<style scoped>
    .shop{
        position: absolute;
        top: 0;
        display: flex;
        flex-direction: column;
        height: 100vh;
        z-index: 100;
        width: 100vw;
        padding: 10px;
        background: white;
    }

    fieldset{
        height: 90%;
        width: 90%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        border: 1.5px solid #cda349;
        padding: 0 2%;
    }

    legend{
        padding: 5px 10px;
        font-size: 1.5rem;
    }

    .parent{
        height: -webkit-fill-available;
    }

    @media screen and (min-width: 601px) and (max-width: 1200px){
        .parent{
            width: 75vw !important
        }
    }

    @media screen and (min-width: 601px){
        .shop{
            position: fixed;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
        }

        .parent{
            width: 40vw;
            background: white;
            position: absolute;
            right: 0;
            padding-left: 2%;
            padding-top: 2%;
        }

        .button{
            top: 0;
        }
    }
</style>