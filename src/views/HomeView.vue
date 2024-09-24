<script setup>
  function toSearch(e) {
    const search = document.getElementById('search')
    if(!search.contains(e.target)){
      document.getElementById('input').style.display = `none`
      search.style.margin = '0 20px 0 0';
    }
    else{
      document.getElementById('input').style.display = `inline`
      search.style.margin = '0';
    }
  }
</script>

<template>
  <main @click="toSearch">
   <div class="container">
    <img src="@/assets/Background.png" alt="Background" class="background">
    <nav>
      <span class="icon-paragraph-justify"></span>
      <span> <img src="@/assets/Logo.png" alt="Crochett Accesories"></span>
      <section>
        <span class="icon-search" id="search">
          <input type="text" placeholder="Buscar articulo" style="display: none;" id="input">
        </span>
        <span class="icon-cart"></span>
      </section>
    </nav>
    <div class="intro">
      <p>Bienvenidos a Crochett Accesories, tu tienda online en Caracas donde cada regalo cuenta una historia. Descubre regalos unicos, materiales para crear ramos inolvidables, peluches personalizados que llenan de amor cada ocasión. ¡Haz de cada momento algo especial con nosotros!</p>
    </div>
  </div>
  </main>
</template>

<style scoped>
  .container{
    height: 35vh;
    position: absolute;
    display: grid;
    width: 100vw;
    justify-content: center;
    justify-items: start;
  }

  .background{
    position: absolute;
    width: 100vw;
    height: 35vh;
    z-index: -1;
  }

  nav{
    background-color: white;
    color: #CDA349;
    height: 7vh;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: space-evenly;
    width: 90vw;
    margin-top: 15px;
    font-size: 75%;
    border-radius: 50px;
  }

  .icon-search{
    margin-right: 20px;
  }

  input{
    border: 1px #cda349 solid;
    border-radius: 10px;
    text-align: center;
    margin: 0 10px;
    font-size: larger;
  }

  nav span{
    cursor: pointer;
  }

  nav span img{
    height: 6em;
    cursor: default;
  }

  .intro{
    width: 60vw;
    font-size: 0.8em;
  }

  section{
    display: flex;
    align-items: center;
  }

  @media screen and (min-width: 601px) {
    .intro{
      font-size: 1.5em;
    }

    nav{
      font-size: larger;
    }
  }
</style>
