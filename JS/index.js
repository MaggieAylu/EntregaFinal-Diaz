const contenidoProductos = document.getElementById('caja-contenedora')
const formulario = document.querySelector('#formulario')
const buscar = document.querySelector('#buscar')
const buscador = document.getElementById('buscador')
const resultado = document.querySelector('#resultado')
const verCarrito = document.getElementById('verCarrito')
const carritoContenido = document.getElementById('carrito-contenido')
const eliminar = document.getElementsByClassName("eliminar")

const productos = []

function accederAProductos(){
    fetch('JS/productos.json')
    .then((response)=> response.json())
    .then((data)=> productos.push(...data))
   .then(()=> cargarProductos())
   .catch((error)=> console.log('error al obtener productos', error))
}
accederAProductos()

const recuperarDatos = () =>{
    if(localStorage.getItem('carrito')){
        return JSON.parse(localStorage.getItem('carrito'))
    } else{
        return []
    }
}

const guardar = () =>{
    if(carrito.length > 0){
        localStorage.setItem('carrito', JSON.stringify(carrito))
    }
} 

const carrito = recuperarDatos()

const agregarAlCarrito = (id) => {
    const agregarCarrito = carrito.find(producto => producto.id === id);
    if (agregarCarrito) {
        agregarCarrito.cantidad++;
    } else {
        const producto = productos.find(producto => producto.id === id);
        carrito.push(producto)
    }
}

const cargarProductos = ()=>{
    productos.forEach((prod) =>{
    let contenido = document.createElement('div')
    contenido.className = "card"
    contenido.innerHTML = `
    <img src="${prod.imagen}">
    <h3 class="contenido">${prod.nombre}</h3>
    <p class="contenido" id="precio">$${prod.precio}</p>
    <button id="boton${prod.id}" class="cart-btn">Comprar</button>
    `
    contenidoProductos.appendChild(contenido)

    const boton = document.getElementById(`boton${prod.id}`)
    boton.addEventListener('click', () =>{
        agregarAlCarrito(prod.id)
    })
    })
}

cargarProductos()

const buscarProducto = () =>{
        resultado.innerHTML = ''
        const texto = formulario.value.toLowerCase()
        for(let prod of productos){
            let nombre = prod.nombre.toLowerCase()
            if(nombre.indexOf(texto) !== -1){
                resultado.innerHTML +=`
                <img src="${prod.imagen}">
                <h3 class="contenido">${prod.nombre}</h3>
                <p class="contenido" id="precio">$${prod.precio}</p>
                <p>${prod.cantidad}</p>
                <button id="boton${prod.id}" class="cart-btn">Comprar</button>`

                const boton = document.getElementById(`boton${prod.id}`)
                boton.addEventListener('click', () =>{
                    agregarAlCarrito(prod.id)
                })
            }
        }
        if(resultado.innerHTML === ''){
            resultado.innerHTML +=`
            <h1>Producto no encontrado...</h1>`    
        }

}

buscar.addEventListener('click', () => {buscarProducto()})

const eliminarDelCarrito = (id) => {
    const producto = carrito.find(producto => producto.id === id);
    if (producto) {
      if (producto.cantidad > 1) {
        producto.cantidad--;
        setTimeout(()=>{
            carritoContenido.classList.add('ocultar')
            Swal.fire({
                title: 'Producto eliminado',
                text: 'Su producto fue eliminado con exito',
                icon: 'success',
                confirmButtonText: 'Cerrar'
            })
        }, 1000)
      } else {
        const indice = carrito.lastIndexOf(producto);
        carrito.splice(indice, 1);
        setTimeout(()=>{
            carritoContenido.classList.add('ocultar')
            Swal.fire({
                title: 'Producto eliminado',
                text: 'Su producto fue eliminado con exito',
                icon: 'success',
                confirmButtonText: 'Cerrar'
            })
        }, 1000)
      }
    }
}

const crearCarrito = () =>{
        carritoContenido.innerHTML = ''
        carritoContenido.classList.add('abrir')
        const tuCarrito = document.createElement('div')
        tuCarrito.className = 'ver-carrito'
        tuCarrito.innerHTML = `
        <h1 class="titulo">Tu Carrito.</h1>
        `
        carritoContenido.appendChild(tuCarrito)
    
        const boton = document.createElement('h1')
        boton.innerText = 'X'
        boton.className = 'cerrar'
        boton.addEventListener('click', () => {
            carritoContenido.classList.add('ocultar')
        })
        tuCarrito.appendChild(boton)
        carritoContenido.classList.remove('ocultar')
    
        carrito.forEach((prod) => {
            let contenido = document.createElement('div')
            contenido.className = 'contenido-del-carrito'
            contenido.innerHTML = `
            <img src="${prod.imagen}"
            <h3>${prod.nombre}</h3>
            <p>$${prod.precio}</p>
            <p>cantidad:${prod.cantidad}</p>
            <button id="eliminar${prod.id}" class="eliminar">Eliminar</button>`
    
            carritoContenido.appendChild(contenido)
    
            const eliminar = document.getElementById(`eliminar${prod.id}`)
    
            eliminar.addEventListener('click', () => {
                eliminarDelCarrito(prod.id);})
        })
      
       const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0)
       const totalPagar = document.createElement('div')
       totalPagar.className = 'total-pagar'
       totalPagar.innerHTML = `Total: $${total}`
       carritoContenido.appendChild(totalPagar)

       guardar()
    
       const finalizarCompra = document.createElement('button')
       finalizarCompra.className = 'cart-btn'
       finalizarCompra.innerHTML = `Finalizar Compra`
       carritoContenido.appendChild(finalizarCompra)
       finalizarCompra.addEventListener('click', () =>{
        if(carrito.length > 0){
            Swal.fire({
                title: '¡Muchas Gracias!',
                text: 'Su compra fue realizada con exito',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            })
            carrito.splice(0,carrito.length)
            carritoContenido.classList.add('ocultar')
        }
        else{
            Swal.fire({
                title: 'Opcion Invalida',
                text: 'El carrito esta vacio',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            })
        }
       })
       carritoContenido.classList.remove('ocultar')
}

verCarrito.addEventListener('click', () =>{crearCarrito()})
