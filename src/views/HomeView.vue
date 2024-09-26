<script setup>
  import { onMounted } from "vue";
  onMounted(()=>{
    let translate = -4;
    let debounceTimeout

    window.addEventListener('resize', () => {
      clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(() => {
        visibleItems = []
        carouselItems = []
        arrow = []
        carouselIndex = 0
        carouselInner.style.transform = `translateX(-4%)`
        visible = false
        setTimeout(checkVisibleItems,500)
      }, 500)
    })

    let arrow;
    let carouselItems;
    let carouselIndex = 0
    let visibleItems = [];

    function checkVisibleItems(){
      carouselItems = document.querySelectorAll('.carousel-item-container')
      arrow = document.querySelector('.icon-arrow-right').getBoundingClientRect()
      carouselItems.forEach((item) => {
        const itemRect = item.getBoundingClientRect()
        if (itemRect.left <= arrow.left) {
          visibleItems.push(item);
        }
      });
    }

    checkVisibleItems()

    let carouselInner = document.querySelector('.carousel-inner')
    let visible = false
    carouselInner.style.transform = `translateX(${translate}%)`

    function checkIfVisible(){
      const lastItemRect = carouselItems[carouselItems.length-1].getBoundingClientRect()
      const arrowRect = document.querySelector('.icon-arrow-right').getBoundingClientRect()
      const carouselRect = document.querySelector('.carousel').getBoundingClientRect()

      if (lastItemRect.right <= carouselRect.right) {
        visible = true
      } else if (lastItemRect.right <= arrowRect.right) {
        visible = false
      } else {
        visible = false
      }
    }

    function navigateCarousel(direction) {
      if (direction === 'next') {
        if(visible){
          visible = false
          carouselIndex = carouselItems.length-1
        }
        carouselIndex < (carouselItems.length-1) ? carouselIndex += 1 : carouselIndex = 0

      } else if (direction === 'prev') {
        if(carouselIndex > 0){
          carouselIndex -= 1
        }
        else{
          visibleItems.length == 1 ? carouselIndex = (carouselItems.length - visibleItems.length) : carouselIndex = (carouselItems.length + 1 - visibleItems.length)
        }
      }
      translate = -4 - (carouselIndex * 107);
      carouselInner.style.transform = `translateX(${translate}%)`;
      setTimeout(()=>{
        checkIfVisible()
      },500)
    }

    document.querySelector('.icon-arrow-right').addEventListener('click', () => navigateCarousel('next'));
    document.querySelector('.icon-arrow-left').addEventListener('click', () => navigateCarousel('prev'));
  })

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
  <main @click="toSearch" @load="Usecarousel">
   <div class="container">
    <img src="@/assets/Background.png" alt="Background" class="background">
    <nav>
      <span class="icon-paragraph-justify"></span>
      <span> <img src="@/assets/Logo.png" alt="Crochett Accesories"></span>
      <section>
        <span class="icon-search" id="search">
          <input type="text" placeholder="Buscar artículo" style="display: none;" id="input">
        </span>
        <span class="icon-cart"></span>
      </section>
    </nav>
    <div class="intro">
      <p>Bienvenidos a Crochett Accesories, tu tienda online en Caracas donde cada regalo cuenta una historia. Descubre regalos unicos, materiales para crear ramos inolvidables, peluches personalizados que llenan de amor cada ocasión. ¡Haz de cada momento algo especial con nosotros!</p>
    </div>
  </div>
  <div class="carousel-container">
    <h3>¡Tu búsqueda del regalo ideal comienza aquí!</h3>
    <div class="row">
      <h4 style="font-size: large;">Categorías</h4>
      <hr>
    </div>
    <br>
    <span class="arrow icon-arrow-left"></span>
    <div class="carousel">
      <div class="carousel-inner">
        <div class="carousel-item">
          <div class="carousel-item-container">
            <img src="@/assets/background.png" alt="Carousel-item">
            <h1 style="text-align: center;">Texto</h1>
          </div>
        </div>
        <div class="carousel-item">
          <div class="carousel-item-container">
            <img src="@/assets/background.png" alt="Carousel-item">
            <h1 style="text-align: center;">Texto</h1>
          </div>
        </div>
        <div class="carousel-item">
          <div class="carousel-item-container">
            <img src="@/assets/background.png" alt="Carousel-item">
            <h1 style="text-align: center;">Texto</h1>
          </div>
        </div>
        <div class="carousel-item">
          <div class="carousel-item-container">
            <img src="@/assets/width_500.webp" alt="Carousel-item">
            <h1 style="text-align: center;">Texto</h1>
          </div>
        </div>
        <div class="carousel-item">
          <div class="carousel-item-container">
            <img src="@/assets/width_500.webp" alt="Carousel-item">
            <h1 style="text-align: center;">Texto</h1>
          </div>
        </div>
        <div class="carousel-item">
          <div class="carousel-item-container">
            <img src="@/assets/width_500.webp" alt="Carousel-item">
            <h1 style="text-align: center;">Texto</h1>
          </div>
        </div>
        <div class="carousel-item">
          <div class="carousel-item-container">
            <img src="@/assets/width_500.webp" alt="Carousel-item">
            <h1 style="text-align: center;">Texto</h1>
          </div>
        </div>
        <div class="carousel-item">
          <div class="carousel-item-container">
            <img src="@/assets/width_500.webp" alt="Carousel-item">
            <h1 style="text-align: center;">Texto</h1>
          </div>
        </div>
        <div class="carousel-item">
          <div class="carousel-item-container">
            <img src="@/assets/width_500.webp" alt="Carousel-item">
            <h1 style="text-align: center;">Texto</h1>
          </div>
        </div>
        <div class="carousel-item">
          <div class="carousel-item-container">
            <img src="@/assets/width_500.webp" alt="Carousel-item">
            <h1 style="text-align: center;">Texto Final</h1>
          </div>
        </div>
      </div>
    </div>
    <span class="arrow icon-arrow-right"></span>
  </div>
  <div class="instructions-container">
    <div class="row">
      <h3>Cómo realizar un pedido personalizado?</h3>
      <hr>
    </div>
    <div class="instructions">
      <div class="instruction">
        <h2 style="text-align: center; color: #cda349">1</h2>
        <p>Es fundamental que planifiques tu pedido con al menos una semana y media de anticipación. Esto nos permite asegurarnos de que podamos dedicar el tiempo y los recursos necesarios para crear tu producto personalizado. Si, por alguna razón, necesitas el pedido en un plazo más corto, ten en cuenta que se aplicará un cargo adicional de $3 por cada carácter de urgencia. Este cargo es necesario para priorizar tu pedido y garantizar que se complete a tiempo.
        </p>
      </div>
      <div class="instruction">
        <h2 style="text-align: center; color: #cda349">2</h2>
        <p>Para poder ofrecerte el mejor servicio posible, es importante que envíes una imagen de referencia del producto que deseas personalizar. Esta imagen nos ayudará a entender exactamente lo que estás buscando y a proporcionarte un precio más preciso. Cuanto más clara y detallada sea la imagen, mejor podremos atender tu solicitud.</p>
      </div>
      <div class="instruction">
        <h2 style="text-align: center; color: #cda349">3</h2>
        <p>Una vez que recibamos tu imagen de referencia, nuestro equipo evaluará el diseño y te proporcionará un precio estimado para tu pedido. Este precio tomará en cuenta factores como la complejidad del diseño, los materiales necesarios y el tiempo de producción. Nos aseguraremos de que entiendas todos los costos involucrados antes de que decidas continuar con el pedido.
        </p>
      </div>
      <div class="instruction">
        <h2 style="text-align: center; color: #cda349">4</h2>
        <p>Si decides proceder con el pedido y el costo total es superior a $10, deberás realizar un pago del 60% del total como anticipo. Este anticipo es esencial para reservar tu pedido y comenzar el proceso de creación. Es importante destacar que este pago del 60% no es reembolsable en caso de cancelación. En caso de que el costo total del pedido sea inferior a $10, el pago deberá hacerse en su totalidad en este momento. </p>
      </div>
      <div class="instruction">
        <h2 style="text-align: center; color: #cda349">5</h2>
        <p>Una vez que tu pedido esté listo para ser entregado, deberás abonar el saldo restante. Si eliges pagar en divisa, este pago debe realizarse el mismo día de la entrega. Sin embargo, si prefieres realizarlo mediante pago móvil, es importante que completes esta transacción antes de la entrega para evitar inconvenientes. Te recordaremos los detalles de pago y la cantidad que queda por abonar cuando se acerque la fecha de entrega.</p>
      </div>
      <div class="instruction">
        <h2 style="text-align: center; color: #cda349">6</h2>
        <p>Es importante que tengas en cuenta que el límite para retirar tu pedido es de 15 días a partir de la fecha de entrega acordada. Si no retiras tu pedido dentro de este plazo, perderás el derecho sobre él y podremos venderlo a otros clientes. Te recomendamos que planifiques con anticipación para asegurarte de que puedes recoger tu pedido a tiempo.</p>
      </div>
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

  .carousel-container{
    position: relative;
    top: 36vh;
  }

  h3{
    text-align: center;
  }

  h1,h2,h5{
    font-weight: 100;
  }

  h2{
    font-family: Helvetica;
  }

  .row{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 90%;
    margin: auto;
  }

  hr{
    border: #cda349 2px solid;
    width: -webkit-fill-available;
    margin-left: 2%;
    height: 0px;
  }
  .carousel {
    position: relative;
    width: 70vw;
    margin: auto;
    overflow: hidden;
    height: 20vh;
    display: flex;
    align-items: center;
  }

  .carousel-inner {
    display: flex;
    flex-wrap: nowrap;
    transition: transform 0.5s;
    height: inherit;
    width: -webkit-fill-available;
  }

  .carousel-item {
    flex: 0 0 20%;
    min-width: 100%;
    margin: 0 10px;
    height: -webkit-fill-available;
    display: flex;
    cursor: pointer;
    justify-content: center
  }

  .carousel-item div img {
    width: 100%;
    height: 75%;
    object-fit: fill;
  }

  .carousel-item-container{
    height: 100%;
    display: flex;
    flex-direction: column;
    width: -webkit-fill-available;
  }

  .arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-20%);
    cursor: pointer;
    z-index: 1;
    color: #CDA349;
    font-size: 4vh;
  }

  .icon-arrow-left {
    left: 5vw;
  }

  .icon-arrow-right {
    right: 5vw;
  }

  .instructions-container{
    position: relative;
    top: 36vh;
  }

  .instructions{
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    margin: 2vh auto;
  }

  .instruction{
    margin: 5% 0;
    flex-basis: 98%;
    text-align: justify;
  }

  .instruction p{
    font-family: "Belleza";
  }

  @media screen and (min-width: 601px) {
    .intro{
      font-size: 1.5em;
    }

    nav{
      font-size: larger;
    }

    .arrow{
      font-size: 400%;
    }

    h3{
      margin: 0;
      padding: 0;
      text-wrap: nowrap;
    }

    .carousel-inner{
      width: auto;
    }

    .carousel-item{
      max-width: 20%;
      width: 0;
    }

    .carousel-item-container{
      width: auto;
    }

    .instruction{
      flex-basis: 40%;
      margin: 1% 4%;
    }
  }
</style>
