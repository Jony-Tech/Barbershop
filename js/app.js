const listacursos = document.querySelector('.lista-cursos');
const carrito = document.querySelector('.carrito');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const logo = document.querySelector('.logo');
let articulosCarrito = [];
// formulario
const formulario = document.querySelector('.formulario');
const nombre = document.querySelector('#nombre');
const correo = document.querySelector('#correo');
const mensaje = document.querySelector('#mensaje');
const btn = document.querySelector('.button')

registrarListeners();
function registrarListeners(){
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('articulosCarrito')) || [];
        carritoHTML();
        
    });
    document.addEventListener('DOMContentLoaded', iniciarBoton);
    
    listacursos.addEventListener('click', agregarCursos);
    logo.addEventListener('click', reiniciar);
    //elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);
    //vacia el carrito 
    vaciarCarritoBtn.addEventListener('click', vaciaCarrito)

    //formulario 
    nombre.addEventListener('blur', validarFormulario);
    correo.addEventListener('blur', validarFormulario);
    mensaje.addEventListener('blur', validarFormulario);
    btn.addEventListener('click', mensajeEnviado);
};

// funciones

function reiniciar(e){
    e.preventDefault();
    if(carrito.classList.value === 'carrito mostrarCarrito'){
        carrito.classList.remove('mostrarCarrito')
    }else{    
    carrito.classList.add('mostrarCarrito');
    }
}

function agregarCursos(e){
    if(e.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado)
        Swal.fire({
            position: 'bottom-end',
            // icon: 'success',
            title: 'agregando al carrito...',
            showConfirmButton: false,
            timer: 700,
          })
        };
        
}
//elimina el curso seleccionado
function eliminarCurso(e){
    e.preventDefault();
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id');
        //elimina del arreglo por el data id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);
        carritoHTML(); // iterar sobre el carrito y mostrar su html
    }
}
//vacia carrito
function vaciaCarrito(){
    articulosCarrito = [];
    localStorage.removeItem('articulosCarrito');
    limpiarHTML()
}
//lee el contenido de html al que le dimos click
function leerDatosCurso(curso){
    //crear una objeto 
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        nombre: curso.querySelector('.titulo').textContent,
        precio: curso.querySelector('.precio').textContent,
        id: curso.querySelector('button').getAttribute('data-id'),
        cantidad: 1
    };
    //revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id);
    if(existe){
        //actualizar la cantidad
        const cursos = articulosCarrito.map( curso => {
            if(curso.id === infoCurso.id){
                curso.cantidad++; //retorna el objeto actualizado
                return curso;
            }else{
                return curso; //retorna los objetos que no son los duplicados
            }
        });
        articulosCarrito = [...cursos];
    }else{
        //agrega elementos al arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }
   
    carritoHTML();
};

//muestra el carrito de compras en el html
function carritoHTML(){

    //limpiar el html
    limpiarHTML();
    articulosCarrito.forEach( curso => {
        const {imagen, nombre, cantidad, precio, id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
        <td><img src="${imagen}" width= "100%"></td>
        <td> ${nombre}</td>
        <td>${cantidad}</td>
        <td>${precio}</td>
        <td><a href='#' class='borrar-curso' data-id="${id}">x</a></td>
        `;

        //agrega el html del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });
    sincronizarLocalStorage();
};

function sincronizarLocalStorage() {
    localStorage.setItem('articulosCarrito', JSON.stringify(articulosCarrito));
}
//elimina los cursos del tbody
function limpiarHTML(){
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}

function iniciarBoton(){
    btn.disabled = true;
}

//formulario
function validarFormulario(e){
    const error = e.target.value;
    const mensajeError = document.querySelector('.formulario p');
    if(mensajeError){
        mensajeError.remove();
    };
    if(e.target.type === 'email'){
        if(error !== '' && error.includes('@') && error.includes('.')){
            formularioValidado(e);
        }else{
            errorFormulario(e);
            mostrarError('Email invalido');
        }
    }else{
        if(error  === ''){
            if(e.target.classList.value !== 'errorInput'){
                errorFormulario(e);
                mostrarError('Faltan campos por llenar');
            }
        }else{
            formularioValidado(e);
        }
    }
    if(nombre.classList.value === 'validado' && correo.classList.value === 'validado' && mensaje.classList.value === 'validado'){
        btn.disabled = false;
        btn.removeAttribute('id')
    }
    
}

//error de formulario 

function errorFormulario(e){
    e.target.classList.remove('validado');
    e.target.classList.add('errorInput');
}
//formulario validado
function formularioValidado(e){
    e.target.classList.remove('errorInput');
    e.target.classList.add('validado');
}
function mostrarError(error){
    const mensajeError = document.createElement('p');
    mensajeError.textContent = error;

    formulario.appendChild(mensajeError);
}
function mensajeEnviado(){
    Swal.fire({
        icon: 'success',
        title: 'Mensaje Enviado',
        showConfirmButton: false,
        timer: 1500
      });
      btn.setAttribute("id", "boton");
    iniciarBoton();
    formulario.reset();
    nombre.classList.remove('validado');
    correo.classList.remove('validado');
    mensaje.classList.remove('validado');
}