<template>
    <Back></Back>
    <br><br>
    <div class="parent">
        <div class="row">
            <h3 style="text-wrap: nowrap;">Resumen del pedido</h3>
            <hr>
        </div>
        <br>
        <div class="products-resume">

            <div class="left">
                <div class="products" v-for="product in cart.productsCart">
                    {{ product[1][1] }} - {{ product[0] }} Unidad(es)
                </div>
            </div>

            <div class="right">
                <div class="prices" v-for="product in cart.productsCart">
                    {{ product[1][2] * product[0] }}$ / {{ product[1][3] * product[0] }} Bs
                </div>
            </div>
        </div>
        <br>
        <p class="total" style="text-align: center;">Total a pagar: {{cart.total$}}$ ó {{cart.totalBs}} Bs</p>

        <div class="mobile" style="background: #cda349; margin: 10px 0;">
            <h3 style="text-align: center;font-weight:100; font-family: 'Belleza'; padding: 2%">Información de contacto</h3>
        </div>
        <div class="form">
            <div class="mobile">
                <form>
                    <div class="row names">
                        <input type="text" id="name" placeholder="Nombre">
                        <input type="text" id="lastName" placeholder="Apellido">
                    </div>
                    <br>
                    <input type="text" id="id" placeholder="Cédula. Eg: V12345678" min="0">
                    <br>
                    <input type="email" id="email" placeholder="Correo electrónico">
                    <br>
                    <input type="text" id="address" placeholder="Dirección">
                    <br>
                    <input type="text" id="city" placeholder="Ciudad">
                <br>
                <select id="state">
                    <option value="" disabled selected style="display: none;">Estado</option>
                    <option value="Amazonas">Amazonas</option>
                    <option value="Anzoategui">Anzoátegui</option>
                    <option value="Apure">Apure</option>
                    <option value="Aragua">Aragua</option>
                    <option value="Barinas">Barinas</option>
                    <option value="Bolivar">Bolívar</option>
                    <option value="Carabobo">Carabobo</option>
                    <option value="Cojedes">Cojedes</option>
                    <option value="Delta Amacuro">Delta Amacuro</option>
                    <option value="Distrito Capital">Distrito Capital</option>
                    <option value="Falcon">Falcón</option>
                    <option value="Guarico">Guárico</option>
                    <option value="Lara">Lara</option>
                    <option value="Merida">Mérida</option>
                    <option value="Miranda">Miranda</option>
                    <option value="Monagas">Monagas</option>
                    <option value="Nueva Esparta">Nueva Esparta</option>
                    <option value="Portuguesa">Portuguesa</option>
                    <option value="Sucre">Sucre</option>
                    <option value="Tachira">Táchira</option>
                    <option value="Trujillo">Trujillo</option>
                    <option value="La Guaira">La Guaira</option>
                    <option value="Yaracuy">Yaracuy</option>
                    <option value="Zulia">Zulia</option>
                </select>
                    <br>
                    <input type="text" id="phone" placeholder="Teléfono. Eg: 0414-1234789" min="0">
                </form>
                <div class="mobile" style="background: #cda349; margin: 10px 0;">
                    <h3 style="text-align: center;font-weight:100; font-family: 'Belleza'; padding: 2%">Métodos de Envío
                    </h3>
                </div>
                <div>
                    <div class="labels">
                        <div class="label-container">
                            <input type="radio" id="personal" name="delivery" value="Entrega Personal">
                            <label for="personal">Entrega Personal</label>
                            <br>
                        </div>
                    </div>
                    <small style="text-align: center; display: block; margin: 10px auto; width: 70%;">Lunes: Hoyada 2:30 p.m
                        <br></br>
                        Viernes: Avenida Urdaneta 2:30 p.m
                    </small>
                    <div class="labels">
                        <div class="label-container">
                            <input type="radio" id="delivery" name="delivery" value="Delivery">
                            <label for="delivery">Delivery</label><br>
                        </div>
                    </div>
                    <small style="text-align: center; display: block; margin: 10px auto; width: 70%;">
                        Con costo adicional dependiendo de la zona
                    </small>
                    <div class="labels">
                        <div class="label-container">
                            <input type="radio" id="national" name="delivery" value="Envío Nacional">
                            <label for="national">Envío Nacional</label>
                        </div>
                    </div>
                    <small style="text-align: center; display: block; margin: 10px auto; width: 70%;">
                        Realizamos envíos por zoom y tealca de lunes a Viernes de 11:00 a.m a 3 p.m
                    </small>
                </div>
                <div class="mobile" style="background: #cda349; margin: 10px 0;">
                    <h3 style="text-align: center;font-weight:100; font-family: 'Belleza'; padding: 2%">Métodos de pago
                    </h3>
                </div>
                <div>
                    <div class="labels">
                        <div class="label-container">
                            <input type="radio" id="bank" name="pay" value="Pago Movil">
                            <label for="bank">Pago Movil</label>
                        </div>
                    </div>
                    <div class="labels">
                        <div class="label-container">
                            <input type="radio" id="zinli" name="pay" value="Zinli">
                            <label for="zinli">Zinli</label><br>
                        </div>
                    </div>
                    <div class="labels">
                        <div class="label-container">
                            <input type="radio" id="cash" name="pay" value="Efectivo">
                            <label for="cash">Efectivo (Dólares)</label>
                        </div>
                    </div>
                    <div class="labels">
                        <div class="label-container">
                            <input type="radio" id="binance" name="pay" value="Binance">
                            <label for="binance">Binance</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pc pc-parent">
                <h3 style="text-align: center;font-weight:100; font-family: 'Belleza'; padding: 2%">Información de contacto</h3>
                <h3 style="text-align: center;font-weight:100; font-family: 'Belleza'; padding: 2%">Métodos de Envío</h3>
                <h3 style="text-align: center;font-weight:100; font-family: 'Belleza'; padding: 2%">Métodos de pago</h3>
                <form>
                    <div class="row names">
                        <input type="text" id="pc-name" placeholder="Nombre">
                        <input type="text" id="pc-lastName" placeholder="Apellido">
                    </div>
                    <br>
                    <input type="text" id="pc-id" placeholder="Cédula. Eg: V12345678" min="0">
                    <br>
                    <input type="email" id="pc-email" placeholder="Correo electrónico">
                    <br>
                    <input type="text" id="pc-address" placeholder="Dirección">
                    <br>
                    <div class="row row-address">
                        <input type="text" id="pc-city" placeholder="Ciudad">
                        <select id="pc-state">
                            <option value="" disabled selected style="display: none;">Estado</option>
                            <option value="Amazonas">Amazonas</option>
                            <option value="Anzoategui">Anzoátegui</option>
                            <option value="Apure">Apure</option>
                            <option value="Aragua">Aragua</option>
                            <option value="Barinas">Barinas</option>
                            <option value="Bolivar">Bolívar</option>
                            <option value="Carabobo">Carabobo</option>
                            <option value="Cojedes">Cojedes</option>
                            <option value="Delta Amacuro">Delta Amacuro</option>
                            <option value="Distrito Capital">Distrito Capital</option>
                            <option value="Falcon">Falcón</option>
                            <option value="Guarico">Guárico</option>
                            <option value="Lara">Lara</option>
                            <option value="Merida">Mérida</option>
                            <option value="Miranda">Miranda</option>
                            <option value="Monagas">Monagas</option>
                            <option value="Nueva Esparta">Nueva Esparta</option>
                            <option value="Portuguesa">Portuguesa</option>
                            <option value="Sucre">Sucre</option>
                            <option value="Tachira">Táchira</option>
                            <option value="Trujillo">Trujillo</option>
                            <option value="La Guaira">La Guaira</option>
                            <option value="Yaracuy">Yaracuy</option>
                            <option value="Zulia">Zulia</option>
                        </select>
                    </div>
                    <br>
                    <input type="text" id="pc-phone" placeholder="Teléfono. Eg: 0414-1234789" min="0">
                </form>
                <div class="mobile" style="background: #cda349; margin: 10px 0;">
                    <h3 style="text-align: center;font-weight:100; font-family: 'Belleza'; padding: 2%">Métodos de Envío
                    </h3>
                </div>
                <div>
                    <div class="labels">
                        <div class="label-container">
                            <input type="radio" id="pc-bank" name="pay" value="Pago Movil">
                            <label for="pc-bank">Pago Movil</label>
                        </div>
                    </div>
                    <div class="labels">
                        <div class="label-container">
                            <input type="radio" id="pc-zinli" name="pay" value="Zinli">
                            <label for="pc-zinli">Zinli</label><br>
                        </div>
                    </div>
                    <div class="labels">
                        <div class="label-container">
                            <input type="radio" id="pc-cash" name="pay" value="Efectivo">
                            <label for="pc-cash">Efectivo (Dólares)</label>
                        </div>
                    </div>
                    <div class="labels">
                        <div class="label-container">
                            <input type="radio" id="pc-binance" name="pay" value="Binance">
                            <label for="pc-binance">Binance</label>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="labels">
                        <div class="label-container label-container-delivery">
                            <div style="width: 100%;display: flex; align-items: center;">
                                <input type="radio" id="pc-personal" name="delivery" value="Entrega Personal">
                                <label for="pc-personal">Entrega Personal</label>
                            </div>
                            <small>Lunes: Hoyada 2:30 p.m
                                <br></br>
                                Viernes: Avenida Urdaneta 2:30 p.m
                            </small>
                        </div>
                    </div>
                    <div class="labels">
                        <div class="label-container label-container-delivery">
                            <div style="width: 100%;display: flex; align-items: center;">
                                <input type="radio" id="pc-delivery" name="delivery" value="Delivery">
                                <label for="pc-delivery">Delivery</label><br>
                            </div>
                            <small>
                                Con costo adicional dependiendo de la zona
                            </small>
                        </div>
                    </div>
                    <div class="labels">
                        <div class="label-container label-container-delivery">
                            <div style="width: 100%;display: flex; align-items: center;">
                                <input type="radio" id="pc-national" name="delivery" value="Envío Nacional">
                                <label for="pc-national">Envío Nacional</label>
                            </div>
                            <small>Realizamos envíos por zoom y tealca de lunes a Viernes de 11:00 a.m a 3 p.m</small>
                        </div>
                    </div>
                </div>
                <div class="mobile" style="background: #cda349; margin: 10px 0;">
                    <h3 style="text-align: center;font-weight:100; font-family: 'Belleza'; padding: 2%">Métodos de pago
                    </h3>
                </div>
            </div>
        </div>
        <br>
        <Button @click="cart.validate()"></Button>
        <br>
    </div>
</template>

<style scoped>
    .products-resume{
        display: flex;
        gap: 20%;
        justify-content: center;
    }

    .prices, .products{
        margin: 12px 0;
    }

    .prices, .products, .total{
        font-family: "Belleza"
    }

    .total{
        margin-bottom: 10px;
    }

    .parent, form{
        display: flex;
        flex-direction: column;
    }

    input, select{
        font-family: auto;
        font-size: 16px;
        border-radius: 3px;
        border: solid 1px #cda349;
        padding: 2%;
        width: 80%;
        position: relative;
        margin: auto;
    }

    #state, #pc-state {
        color: #757575;
        width: 85%;
    }

    .names input{
        width: 40%;
    }

    input[type="radio"]{
        appearance: none;
        border-radius: 50%;
        width: 12%;
        height: 16px;
        border: 2px solid #cda349;
        margin:0 2px 0 0;
        transition: .1s all ease;
    }

    .labels{
        display: flex;
        justify-content: center;
        font-family: "Belleza";
    }

    .label-container{
        display: flex;
        width: 40%;
        margin-top: 5px;
    }

    input[type="radio"]:checked {
        border: 6px solid #CDA349
    }

    input[type="radio"], label{
        cursor: pointer;
    }

    .pc{
        display: none
    }

    .button{
        margin: 0 auto 7%;
    }

    @media screen and (min-width: 601px) {
        .pc{
            display: flex;
            justify-content: center;
            gap: 10px;
        }

        .names input{
            width: 45%;
        }

        .row-address *{
            width: 47% !important;
        }

        input{
            width: 85%;
        }

        .mobile{
            display: none;
        }

        input[type="radio"]{
            width: 28px;
            height: 28px;
        }

        .label-container{
            align-items: center;
        }

        .pc-parent {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: 0fr 2fr;
            grid-column-gap: 0px;
            grid-row-gap: 10px;
        }

        #app > div > div.form > div.pc.pc-parent > h3:nth-child(1) {
            grid-area: 1 / 1 / 2 / 3;
            background-color: #CDA349;
            display: grid;
            place-content: center;
        }

        #app > div > div.form > div.pc.pc-parent > h3:nth-child(2) {
            grid-area: 1 / 3 / 2 / 4;
            background-color: #CDA349;
            display: grid;
            place-content: center;
        }

        #app > div > div.form > div.pc.pc-parent > h3:nth-child(3) {
            grid-area: 1 / 4 / 2 / 5;
            background-color: #CDA349;
            display: grid;
            place-content: center;
        }

        form { grid-area: 2 / 1 / 3 / 3; }

        #app > div > div.form > div.pc.pc-parent > div:nth-child(6) { grid-area: 2 / 4 / 3 / 5; }

        #app > div > div.form > div.pc.pc-parent > div:nth-child(7),#app > div > div.form > div.pc.pc-parent > div:nth-child(6){
            display: flex;
            flex-direction: column;
            justify-content: space-around;
        }

        .label-container-delivery{
            flex-direction: column;
        }

        small{
            width: 100%;
            margin-top: 2%;
            font-size: 0.85rem;
        }

        .products-resume{
            gap: 50%;
        }
    }
</style>

<script setup>
    import { onMounted } from "vue";
    import Back  from "@/components/Back.vue";
    import Button from "@/components/Button.vue";
    import { Cart } from "@/Stores/Cart";
    const cart = Cart()

    onMounted(()=>{
        if(cart.productsCart.length == 0){
            alert("Tu carrito está vacio")
            window.history.back()
        }
        const selects = [document.getElementById('state'), document.getElementById('pc-state')]
        const states = selects.map(() => ({ opened: false, changed: false }))

        window.addEventListener('resize', () => {
            selects.forEach((select, index) => {
                states[index].opened = false
                states[index].changed = false
            })
        })

        selects.forEach((select, index) => {
            select.addEventListener('change', ()=>{
                states[index].changed = true
                states[index].opened = true
            })

            select.addEventListener('click',()=>{
                if(!states[index].changed && !states[index].opened){
                    select.style.color = "black"
                }
                else{
                    select.value == '' ? select.style.color = "#757575" : select.style.color = "black"
                }
                if(!states[index].changed){
                    states[index].opened = !states[index].opened
                }
            })

            select.addEventListener('blur',()=>{
                select.value == '' ? select.style.color = "#757575" : ""
            })
        })
    })
</script>