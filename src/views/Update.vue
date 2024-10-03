<template>
    <div class="update">
        <div class="container">
            <h1>Sube el excel</h1>
            <input type="file" class="inputfile"  id="fileUpload" accept=".xls,.xlsx" @change="detected">
            <label for="fileUpload">Elegir Archivo</label>
            <br>
            <p id="text"></p>
        </div>
        <Button :text="'Subir'" @click="console.log('Hola')"></Button>
    </div>
</template>

<script setup>
    import Button from '@/components/Button.vue';
    function detected() {
        document.getElementById('text').innerText = document.getElementById('fileUpload').files[0].name
    }
</script>

<style scoped>
    h1{
        text-align: center;
        position: absolute;
        margin-top: 2%;
        top: 0;
        left: 0;
        width: 100%;
    }

    .container{
        background-color: #fce4b0a9;
        border-radius: 10px;
        height: 50vh;
        width: 50vw;
        position: absolute;
        left: 21%;
        top: 21%;
        padding: 4%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }

    .update{
        display: grid;
        place-content: center;
        height: 90vh;
        width: 100vw;
    }

    .inputfile {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }

    .inputfile + label {
        font-family: "Belleza";
        font-size: 1.25em;
        font-weight: 700;
        color: white;
        background-color: black;
        display: inline-block;
        padding: 2%;
        text-align: center;
        transition: all .5s ease;
    }

    .inputfile:focus + label,
    .inputfile + label:hover {
        background-color: #cda349;
    }

    .inputfile + label {
	    cursor: pointer;
    }

    .button{
        top: 25vh;
        margin: auto;
    }

    #text{
        font-size: 1.5rem;
        text-align: center;
    }
</style>