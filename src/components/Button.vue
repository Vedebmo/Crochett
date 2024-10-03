<template>
    <div class="button">
        <img src="../assets/Frame.webp" alt="Botón">
        <p>{{text}}</p>
    </div>
</template>

<style scoped>
    .button {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        z-index: 1;
        width: 50%;
        cursor:default;
    }

    .button a{
        color: black;
    }

    .button img {
        width: 110%;
        height: 110%;
        object-fit: cover;
        transition: background ease 1s;
        cursor: pointer;
    }

    .button p {
        position: absolute;
        text-wrap: nowrap;
        font-size: 130%;
        z-index: 2;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        transition: color ease 1s;
        cursor: pointer;
    }

    .button:hover img{
        background-color: #CDA349;
    }

    .button:hover p{
        color: white;
    }
    @media screen and (min-width: 601px) {
        .button{
            /* width: auto; */
            width: fit-content !important;
            height: 3vh;
            top: 10vh;
        }

        .button img{
            height: 170%;
            width: 14rem;
            object-fit: unset;
        }

        .button p{
            left: 50%;
        }
    }
</style>

<script>
    export default{
        name: 'Button',
        props: {
            text:{
                default: 'Comprar'
            }
        }
    }
</script>