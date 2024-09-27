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
  <br>

  <div class="footer-container">
    <div class="button">
      <a href="https://www.whatsapp.com/catalog/584123830362" target="_blank">
        <img src="@/assets/Frame.webp" alt="Botón">
        <p>Haz tu pedido aquí</p>
      </a>
    </div>
    <div class="heart">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="107.6" preserveAspectRatio="xMidYMid meet" version="1.0" viewBox="0.3 -2.4 487.8 107.6" width="487.8" zoomAndPan="magnify"><path d="M485.783,63.315 c1.035-7.044-37.25-8.854-41.621-9.027c-20.736-0.82-41.203,1.426-61.496,5.596c-17.766,3.651-35.393,8.258-52.738,13.552 c-12.422,3.791-24.48,8.875-37.156,11.794c-23.641,5.445-51.701,5.928-73.911-5.071c-15.772-7.811-30.524-22.026-34.418-39.833 c-2.858-13.072,1.245-28.825,13.568-35.703c9.567-5.339,21.628-3.543,30.128,3.201c5.436,4.313,8.827,9.577,8.519,16.571 c-0.079,1.802,0.214,4.884-0.668,6.367c-3.125-4.174,1.542-9.964,4.663-12.477c9.736-7.839,24.123-7.235,35.49-4.077 c8.107,2.252,15.707,6.685,18.732,14.992c2.83,7.765,0.172,16.261-3.469,23.223c-5.777,11.05-15.846,17.99-26.156,24.504 c-13.445,8.496-28.273,14.678-43.75,18.379c-35.196,8.417-71.896,7.876-106.699-2.158c-23.821-6.867-44.934-20.295-68.709-27.2 c-8.599-2.498-17.632-4.188-26.547-5.055c-4.273-0.416-8.731-0.991-12.979-0.049c-1.828,0.405-3.908,0.951-5.316,2.206" fill="none" stroke="#f8a9ac" stroke-miterlimit="10" stroke-width="3"/></svg>
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
    height: 33vh;
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

  .button {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
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
    transition: all ease 1s;
    cursor: pointer;
  }

  .button p {
    position: absolute;
    text-wrap: nowrap;
    font-size: 130%;
    z-index: 2;
    top: 45%;
    left: 55%;
    transform: translate(-50%, -50%);
    text-align: center;
    transition: all ease 1s;
    cursor: pointer;
  }

  .button:hover img{
    background-color: #CDA349;
  }

  .button:hover p{
    color: white;
  }

  .footer-container{
    position:relative;
    top: 35vh;
    display: grid;
    justify-items: end;
  }

  .heart{
    overflow: clip;
    height: fit-content;
    width: fit-content;
  }

  .heart svg{
    transform: rotate(-22.5deg);
    position: relative;
    left: 30%;
    width: 100%;
  }

  body {
    overflow-x: hidden;
  }

  @media screen and (min-width: 601px) {
    .intro{
      font-size: 2vh;
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

    .carousel{
      height: 150px;
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

    .button{
      width: auto;
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

    .heart svg{
      height: 20vh;
    }
  }
</style>
