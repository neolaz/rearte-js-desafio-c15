const clientElement = document.getElementById("cliente");
const tipoDocumentoElement = document.getElementById("tipoDocumento");
const centroEmisorElement = document.getElementById("centroEmisor");
const numeroElement = document.getElementById("numero");
const cantidad1Element = document.getElementById("cantidad1");
const producto1Element = document.getElementById("producto1");
const cantidad2Element = document.getElementById("cantidad2");
const producto2Element = document.getElementById("producto2");
const cantidad3Element = document.getElementById("cantidad3");
const producto3Element = document.getElementById("producto3");
const cantidad4Element = document.getElementById("cantidad4");
const producto4Element = document.getElementById("producto4");
const cantidad5Element = document.getElementById("cantidad5");
const producto5Element = document.getElementById("producto5");
const totalElement = document.getElementById("total");
const confirmarElement = document.getElementById("confirmar");
const cancelarElement = document.getElementById("cancelar");
const cabecerasListadoElement = document.getElementById("cabecerasListado");
const documentoRowElement = document.getElementById("documentoRow");
const containerCancelarElement = document.getElementById("containerCancelar");
const containerConfirmarElement = document.getElementById("containerConfirmar");

let idEnUso = 0;
let modo = 'ins';

// Calcula el total del documento.
const calcularTotal = (listaDocumentoDetalle) => {
    let impuesto;
    let total = 0;

    listaDocumentoDetalle.forEach( (det) => {
        impuesto = 1 + det.producto.impuesto / 100;
        total += det.producto.precio * det.cantidad * impuesto;
    });
    return total;
}

class Producto{
    constructor (id, nombre, precio, impuesto, stock){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.impuesto = impuesto;
        this.stock = stock;
    }
}

class Documento{
    constructor (id, cliente, tipo, centroEmisor, numero, listaDocumentoDetalle){
        this.id = id;
        this.cliente = cliente;
        this.tipo = tipo;
        this.centroEmisor = centroEmisor;
        this.numero = numero;
        this.listaDocumentoDetalle = listaDocumentoDetalle;
        this.total = calcularTotal(listaDocumentoDetalle);
    }
}

class DocumentoDetalle{
    constructor (producto, cantidad){
        this.producto = producto;
        this.cantidad = cantidad;
    }
}

const obtenerProductos = async () => {
    const resp = await fetch("./data.json"); 
    const post = await resp.json();

    localStorage.setItem('productos', JSON.stringify(post));
}

obtenerProductos();

// Ordena los documentos por tres criterios distintos simultáneamente: Tipo de Documento, Centro Emisor y Número.
const ordernarDocumentos = () => {
    let listaDocumentos = JSON.parse(localStorage.getItem('listaDocumentos')) || [];

    for(let i = 0; i < listaDocumentos.length; i++){
        for(let j = 0; j < listaDocumentos.length - 1; j++){
            if ((listaDocumentos[j].tipo > listaDocumentos[j + 1].tipo) ||
                (listaDocumentos[j].tipo == listaDocumentos[j + 1].tipo && listaDocumentos[j].centroEmisor > listaDocumentos[j + 1].centroEmisor) ||
                (listaDocumentos[j].tipo == listaDocumentos[j + 1].tipo && listaDocumentos[j].centroEmisor == listaDocumentos[j + 1].centroEmisor && listaDocumentos[j].numero > listaDocumentos[j + 1].numero)) {
                let documentoAux = listaDocumentos[j];
                listaDocumentos[j] = listaDocumentos[j + 1];
                listaDocumentos[j + 1] = documentoAux;
            }
        }
    }
    localStorage.setItem('listaDocumentos', JSON.stringify(listaDocumentos));
}

// Muestra el listado de Documentos.
const mostrarListadoDocumentos = () => {    
    let listaDocumentos = JSON.parse(localStorage.getItem('listaDocumentos')) || [];

    documentoRowElement.innerHTML = '';

    if(listaDocumentos.length == 0){
        cabecerasListadoElement.innerHTML = `
        <div class="col-xl-2 offset-md-5">
            <div class="containerInput alignCenter">
                <span class="textGeneric displayInlineBlock" for="numero">Aún no hay Documentos generados</span>
            </div>
        </div>
        `;
    }

    if(listaDocumentos.length > 0){
        cabecerasListadoElement.innerHTML = `
            <div class="col-xl-2 offset-md-1">
                <div class="containerInput alignCenter">
                    <span class="textGeneric displayInlineBlock" for="TipoDocumento">Tipo de Documento</span>
                </div>
            </div>
            <div class="col-xl-1">
                <div class="containerInput alignCenter">
                    <span class="textGeneric displayInlineBlock" for="CentroEmisor">Centro Emisor</span>
                </div>
            </div>
            <div class="col-xl-1">
                <div class="containerInput alignCenter">
                    <span class="textGeneric displayInlineBlock" for="Numero">Número</span>
                </div>
            </div>
            <div class="col-xl-2">
                <div class="containerInput alignCenter">
                    <span class="textGeneric displayInlineBlock" for="Cliente">Cliente</span>
                </div>
            </div>
            <div class="col-xl-2">
                <div class="containerInput alignCenter">
                    <span class="textGeneric displayInlineBlock" for="Total">Total</span>
                </div>
            </div>
            <div class="col-xl-2">
            </div>
        `;

        ordernarDocumentos();
    
        listaDocumentos.forEach( (doc) => { 
            let {id, tipo, centroEmisor, numero, cliente, total} = doc;

            documentoRowElement.innerHTML += `
                <div class="row">
                    <div class="col-xl-2 offset-md-1 gridRowColor">
                        <div class="containerInput alignCenter">
                            <p class="textGeneric">${tipo}</p>
                        </div>
                    </div>
                    <div class="col-xl-1 gridRowColor">
                        <div class="containerInput alignCenter">
                            <p class="textGeneric">${centroEmisor}</p>
                        </div>
                    </div>
                    <div class="col-xl-1 gridRowColor">
                        <div class="containerInput alignCenter">
                            <p class="textGeneric">${numero}</p>
                        </div>
                    </div>
                    <div class="col-xl-2 gridRowColor">
                        <div class="containerInput alignCenter">
                            <p class="textGeneric">${cliente}</p>
                        </div>
                    </div>
                    <div class="col-xl-2 gridRowColor">
                        <div class="containerInput alignCenter">
                            <p class="textGeneric">${total}</p>
                        </div>
                    </div>
                    <div class="col-xl-2 gridRowColor">
                        <div class="alignCenter">
                            <a class="buttonGrid" onclick="gestionarVisualizarDocumento(${id})">
                                <img src="img/search.png" alt="Visuaizar Documento" title="Visualizar">
                            </a>
                            <a class="buttonGrid" onclick="gestionarModificarDocumento(${id})">
                                <img src="img/edit.png" alt="Modificar Documento" title="Modificar">
                            </a>
                            <a class="buttonGrid" onclick="eliminarDocumento(${id})">
                                <img src="img/delete.png" alt="Eliminar Documento" title="Eliminar">
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });
    }
}

// Muestro los Documentos que están en el Local Storage.
mostrarListadoDocumentos();

// Valida que se haya seleccionado Cliente.
const validarCliente = (msgError) => {
    let cliente = clientElement.value;

    if (cliente == '') msgError += 'Seleccione Cliente\n';   
    return msgError;
}

// Valida que se haya seleccionado Tipo de Documento.
const validarTipoDocumento = (msgError) => {
    let tipoDocumento = tipoDocumentoElement.value;

    if(tipoDocumento == '' ) msgError += 'Seleccione Tipo de Documento\n';
    return msgError;
}

// Valida que se haya seleccionado Centro Emisor.
const validarCentroEmisor = (msgError) => {
    let centroEmisor = centroEmisorElement.value;

    if (centroEmisor == '') msgError += 'Seleccione Centro Emisor\n';
    return msgError;
}

// Valida que se haya asignado Número.
const validarNumero = (msgError) => {
    let numero = numeroElement.innerHTML;

    if (numero == '00000000') msgError += 'Seleccione Tipo de Documento y Centro Emisor\n';
    return msgError;
}

// Valida que no se estén facturando más productos de los que se tienen en stock.
const validarStock = (msgError) => {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    let stockEnUso;

    productos.forEach( (p) => {
        stockEnUso = 0;

        for (let i = 1; i < 6; i++) {
            cantidadInput = document.getElementById(`cantidad${i}`).value;
            productoInput = document.getElementById(`producto${i}`).value;
            if(p.id == productoInput && cantidadInput > 0){
                stockEnUso += parseInt(cantidadInput);
            }
        }
        if(stockEnUso > p.stock) msgError += `No hay suficiente stock de ${p.nombre}. Hay ${p.stock} unidades en stock y está intentando cargar ${stockEnUso} en el Documento.\n`;
    })
    return msgError;
}

// Valida que se haya cargado correctamente el detalle del Documento.
const validarDetalle = (msgError) => {
    let cantidadInput;
    let productoInput;
    let algunaLineaCargada = false;

    for (let i = 1; i < 6; i++) {
        cantidadInput = document.getElementById(`cantidad${i}`).value;
        productoInput = document.getElementById(`producto${i}`).value;

        if (cantidadInput <= 0 && productoInput != ""){
            algunaLineaCargada = true;
            msgError += `Ingrese la cantidad en la línea ${i} del detalle\n`;
        }

        if (cantidadInput > 0 && productoInput == ""){
            algunaLineaCargada = true;
            msgError += `Seleccione el producto en la línea ${i} del detalle\n`;
        }

        if(cantidadInput > 0 && productoInput != "") algunaLineaCargada = true;
    }

    if(algunaLineaCargada) msgError = validarStock(msgError);

    if (!algunaLineaCargada) msgError += 'Ingrese alguna línea del detalle\n';
    return msgError
}

// Valida que se hayan cargado correctamente los atributos del Documento.
const validarInputs = () => {
    let msgError = '';

    msgError = validarCliente(msgError);
    msgError = validarTipoDocumento(msgError);
    msgError = validarCentroEmisor(msgError);
    if (msgError == '') msgError = validarNumero(msgError);
    msgError = validarDetalle(msgError);
    return msgError;
}

// Muestra mensaje de error.
const mostrarError = (msgError) => {
    Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: msgError,
        background: '#272727',
        color: '#FFFFFF',
        confirmButtonText: 'Confirmar',
        confirmButtonColor: '#30fdb0'
    });
}

// Asigna el Número del Documento. Busca el último Documento generado para el mismo Tipo de Documento y Centro Emisor y le agrega uno.
const asignarNumero = (tipoDocumento, centroEmisor) => {
    let listaDocumentos = JSON.parse(localStorage.getItem('listaDocumentos')) || [];
    let documentosFiltrados = [];
    let numero;
    let numeroStr = '00000000';
    let difLength = 0;

    documentosFiltrados = listaDocumentos.filter( (d) => d.tipo == tipoDocumento && d.centroEmisor == centroEmisor);    // Consigo los documentos del mismo tipo y centro emisor.    
    
    if(documentosFiltrados.length == 0) return '00000001';

    documentosFiltrados.sort( (a,b) => b.numero - a.numero); // Ordeno los documentos filtrados de mayor a menor para obtener el más grande fácilmente.
    numero = parseInt(documentosFiltrados[0].numero) + 1;
    numeroStr += numero;
    difLength = numeroStr.length - 8;
    numeroStr = numeroStr.substring(difLength)
    return numeroStr;
}

// Crea el detalle del Documento.
const crearDetalle = () => {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    let cantidadInput;
    let productoInput;
    let documentoDetalle;
    let listaDocumentoDetalle = [];

    for (let i = 1; i < 6; i++) {
        cantidadInput = document.getElementById(`cantidad${i}`).value;
        productoInput = document.getElementById(`producto${i}`).value;

        if (cantidadInput > 0 && productoInput != ""){
            productos.forEach( (p) => {
                if (productoInput == p.id){
                    p.stock -= parseInt(cantidadInput);
                    documentoDetalle = new DocumentoDetalle(p, cantidadInput);
                    listaDocumentoDetalle.push(documentoDetalle);
                }
            })
        }
    }

    localStorage.setItem('productos', JSON.stringify(productos));
    return listaDocumentoDetalle;
}

// Reinicia el form dejando todos los inputs en vacíos.
const reinciarForm = () => {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];

    clientElement.value = '';
    clientElement.disabled = false;
    clientElement.style.backgroundColor = "#403f3f";
    clientElement.style.color = "#ffffff";
    tipoDocumentoElement.value = '';
    tipoDocumentoElement.disabled = false;
    tipoDocumentoElement.style.backgroundColor = "#403f3f";
    tipoDocumentoElement.style.color = "#ffffff";
    centroEmisorElement.value = '';
    centroEmisorElement.disabled = false;
    centroEmisorElement.style.backgroundColor = "#403f3f";
    centroEmisorElement.style.color = "#ffffff";
    numeroElement.innerHTML = '00000000';
    totalElement.innerHTML = 0;

    // Resto el stock si se estaba modificando el Documento
    if(modo == 'upd'){
        let listaDocumentos = JSON.parse(localStorage.getItem('listaDocumentos')) || [];
        let documentosFiltrados = listaDocumentos.filter( (d) => d.id == idEnUso);
        let documento = documentosFiltrados[0];

        documento.listaDocumentoDetalle.forEach( (det) => {
            productos.forEach( (p) => {
                if (det.producto.id == p.id){
                    p.stock -= parseInt(det.cantidad);
                }
            })
        });   
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    for (let i = 1; i < 6; i++) {
        document.getElementById(`cantidad${i}`).value = 0;
        document.getElementById(`cantidad${i}`).disabled = false;
        document.getElementById(`cantidad${i}`).style.backgroundColor = "#403f3f";
        document.getElementById(`cantidad${i}`).style.color = "#ffffff";
        document.getElementById(`producto${i}`).value = '';
        document.getElementById(`producto${i}`).disabled = false;
        document.getElementById(`producto${i}`).style.backgroundColor = "#403f3f";
        document.getElementById(`producto${i}`).style.color = "#ffffff";
        document.getElementById(`precio${i}`).innerHTML = 0;
        document.getElementById(`impuesto${i}`).innerHTML = 0;
        document.getElementById(`subtotal${i}`).innerHTML = 0;
    } 

    containerCancelarElement.style.display = "block";
    containerConfirmarElement.className = "col-xl-2";
    idEnUso = 0;
    modo = 'ins';
}

// Muestra el Documento para visualizar/modificar.
const mostrarDocumento = (id) => {
    let listaDocumentos = JSON.parse(localStorage.getItem('listaDocumentos')) || [];
    let documentosFiltrados = [];
    let documento;

    documentosFiltrados = listaDocumentos.filter( (d) => d.id == id);
    documento = documentosFiltrados[0];
    let { cliente, tipo, centroEmisor, numero, total, listaDocumentoDetalle } = documento;

    clientElement.value = cliente;
    tipoDocumentoElement.value = tipo;
    centroEmisorElement.value = centroEmisor;
    numeroElement.innerHTML = numero;
    totalElement.innerHTML = total;

    for (let i = 1; i < 6; i++) {
        if(i <= listaDocumentoDetalle.length){
            let { cantidad, producto: { id, precio, impuesto }} = listaDocumentoDetalle[i - 1];

            document.getElementById(`cantidad${i}`).value = cantidad;
            document.getElementById(`producto${i}`).value = id;
            document.getElementById(`precio${i}`).innerHTML = precio;
            document.getElementById(`impuesto${i}`).innerHTML = impuesto;
            document.getElementById(`subtotal${i}`).innerHTML = cantidad * precio * (1 + impuesto / 100);
        } else {
            document.getElementById(`cantidad${i}`).value = 0;
            document.getElementById(`producto${i}`).value = '';
            document.getElementById(`precio${i}`).innerHTML = 0;
            document.getElementById(`impuesto${i}`).innerHTML = 0;
            document.getElementById(`subtotal${i}`).innerHTML = 0;
        }     
    } 
}

// Crea un nuevo documento con los datos cargados en pantalla.
const crearDocumento = () => {
    let listaDocumentos = JSON.parse(localStorage.getItem('listaDocumentos')) || [];
    let cliente = clientElement.value;
    let tipoDocumento = tipoDocumentoElement.value;
    let centroEmisor = centroEmisorElement.value;
    let numero = numeroElement.innerHTML;
    let listaDocumentoDetalle = crearDetalle();
    let ultimoDocumentoId = localStorage.getItem('ultimoDocumentoId') || 1;

    ultimoDocumentoId++;

    let documento = new Documento(ultimoDocumentoId, cliente, tipoDocumento, centroEmisor, numero, listaDocumentoDetalle);

    listaDocumentos.push(documento); 
    localStorage.setItem('listaDocumentos', JSON.stringify(listaDocumentos));
    localStorage.setItem('ultimoDocumentoId', ultimoDocumentoId);
    mostrarListadoDocumentos();
    reinciarForm(); 
    Swal.fire({
        title: 'Documento creado!!',
        text: `Se creó la ${tipoDocumento} del Centro Emisor ${centroEmisor}, número ${numero}.`,
        background: '#272727',
        color: '#FFFFFF',
        confirmButtonText: 'Confirmar',
        confirmButtonColor: '#30fdb0'
    })
}

// Modifica el documento con los datos cargados en pantalla.
const modificarDocumento = (id) => {
    let listaDocumentos = JSON.parse(localStorage.getItem('listaDocumentos')) || [];
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    let documentosFiltrados = listaDocumentos.filter( (d) => d.id == id);
    let documento = documentosFiltrados[0];

    documento.listaDocumentoDetalle.forEach( (det) => {
        productos.forEach( (p) => {
            if (det.producto.id == p.id){
                p.stock += parseInt(det.cantidad);
            }
        })
    });   

    let listaDocumentoDetalle = crearDetalle();

    if(listaDocumentos != null){
        listaDocumentos.forEach( (d) => {
            if(d.id == id){
                d.listaDocumentoDetalle = listaDocumentoDetalle;
                d.total = calcularTotal(listaDocumentoDetalle);
            }
        });
        localStorage.setItem('listaDocumentos', JSON.stringify(listaDocumentos));
        mostrarListadoDocumentos();
        modo = 'ins';
        reinciarForm(); 
    }
}

// Setea la pantalla para visualizar el Documento. Todos los campos estarán como readonly.
const gestionarVisualizarDocumento = (id) => {
    reinciarForm();
    idEnUso = id;
    modo = 'dis';
    mostrarDocumento(id);
    clientElement.disabled = true;
    clientElement.style.backgroundColor = "#2f2f2f";
    clientElement.style.color = "#c6c6c6";
    tipoDocumentoElement.disabled = true;
    tipoDocumentoElement.style.backgroundColor = "#2f2f2f";
    tipoDocumentoElement.style.color = "#c6c6c6";
    centroEmisorElement.disabled = true;
    centroEmisorElement.style.backgroundColor = "#2f2f2f";
    centroEmisorElement.style.color = "#c6c6c6";

    for (let i = 1; i < 6; i++) {
        document.getElementById(`cantidad${i}`).disabled = true;
        document.getElementById(`cantidad${i}`).style.backgroundColor = "#2f2f2f";
        document.getElementById(`cantidad${i}`).style.color = "#c6c6c6";
        document.getElementById(`producto${i}`).disabled = true;
        document.getElementById(`producto${i}`).style.backgroundColor = "#2f2f2f";
        document.getElementById(`producto${i}`).style.color = "#c6c6c6";
    } 

    containerCancelarElement.style.display = "none";
    containerConfirmarElement.className = "col-xl-2 offset-md-5";
}

// Setea la pantalla para modificar el Documento. Todos los campos estarán como readonly salvo el detalle, será lo único que se podra modificar. La cabecera no puede modificarse.
const gestionarModificarDocumento = (id) => {
    let listaDocumentos = JSON.parse(localStorage.getItem('listaDocumentos')) || [];
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    
    reinciarForm();
    idEnUso = id;
    modo = 'upd';
    mostrarDocumento(id);

    // Reasigno el stock
    listaDocumentos.forEach( (d) => {
        if(d.id == id){
            d.listaDocumentoDetalle.forEach( (det) => {
                productos.forEach( (p) => {
                    if (det.producto.id == p.id){
                        p.stock += parseInt(det.cantidad);
                    }
                })
            });   
        }
    });

    localStorage.setItem('productos', JSON.stringify(productos));
    clientElement.disabled = true;
    clientElement.style.backgroundColor = "#2f2f2f";
    clientElement.style.color = "#c6c6c6";
    tipoDocumentoElement.disabled = true;
    tipoDocumentoElement.style.backgroundColor = "#2f2f2f";
    tipoDocumentoElement.style.color = "#c6c6c6";
    centroEmisorElement.disabled = true;
    centroEmisorElement.style.backgroundColor = "#2f2f2f";
    centroEmisorElement.style.color = "#c6c6c6";
}

// Eliminar el Documento.
const eliminarDocumento = (id) => {
    let listaDocumentos = JSON.parse(localStorage.getItem('listaDocumentos')) || [];
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    let {tipo, centroEmisor, numero } = listaDocumentos.filter(d => d.id == id)[0];

    Swal.fire({
        title: 'Eliminar Documento',
        text: `Está seguro que desea eliminar la ${tipo} del Centro Emisor ${centroEmisor}, número ${numero}?`,
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: `Cancelar`,
        background: '#272727',
        color: '#FFFFFF',
        confirmButtonText: 'Confirmar',
        confirmButtonColor: '#30fdb0'
    }).then((result) => {
        if (result.isConfirmed) {
            // Chequeo no estar en modo update para no reasignar dos veces el stock
            if(modo != 'upd'){
                // Reasigno el stock de los productos del Docuento eliminado.
                listaDocumentos.forEach( (d) => {
                    if(d.id == id){
                        d.listaDocumentoDetalle.forEach( (det) => {
                            productos.forEach( (p) => {
                                if (det.producto.id == p.id){
                                    p.stock += parseInt(det.cantidad);
                                }
                            })
                        });   
                    }
                });
            }
            
            modo = 'del';
            listaDocumentos = listaDocumentos.filter(d => d.id != id);
            localStorage.setItem('listaDocumentos', JSON.stringify(listaDocumentos));
            localStorage.setItem('productos', JSON.stringify(productos));
            reinciarForm();
            mostrarListadoDocumentos();
            Swal.fire({
                title: 'Documento Eliminado!',
                background: '#272727',
                color: '#FFFFFF',
                confirmButtonText: 'Confirmar',
                confirmButtonColor: '#30fdb0'
            })
        }
    })
}

// Se encarga de crear/modificar/visualizar un Documento.
const gestionarConfirmar = () => {
    let msgError = '';

    msgError = validarInputs();
    if (msgError != '') mostrarError(msgError);
    if (msgError == '' && modo == 'ins') crearDocumento();
    if (msgError == '' && modo == 'upd') modificarDocumento(idEnUso);
    if (msgError == '' && modo == 'dis') reinciarForm();
}

// Se encarga de asignar el número cuando se cambia de Centro Emisor o Tipo de Documento
const gestionarNumero = () => {
    let tipoDocumentoInput;
    let centroEmisorInput;
    let numero;

    tipoDocumentoInput = tipoDocumentoElement.value;
    centroEmisorInput = centroEmisorElement.value;
    
    if(tipoDocumentoInput != '' && centroEmisorInput != ''){
        numero = asignarNumero(tipoDocumentoInput, centroEmisorInput);   
        numeroElement.innerHTML = numero;
    } else {
        numeroElement.innerHTML = '00000000';
    }
}

// Obtiene un Producto.
const obtenerProductoPorId = (id) => {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    let productosFiltrados;

    productosFiltrados = productos.filter( (p) => p.id == id);
    return productosFiltrados[0];
}

// Se encarga de traer todos los datos del Producto seleccionado y calcula su total teniendo en cuenta la cantidad ingresada.
const gestionarLineaDetalle = (nroLinea) => {
    let cantidadInput;
    let productoInput;
    let subtotalInput;
    let totalInput;
    let total;
    let producto;

    cantidadInput =  document.getElementById(`cantidad${nroLinea}`).value;
    productoInput = document.getElementById(`producto${nroLinea}`).value; 
    subtotalInput =  parseInt(document.getElementById(`subtotal${nroLinea}`).innerHTML);             
    totalInput = parseInt(totalElement.innerHTML);
    total = totalInput - subtotalInput;
        
    if(cantidadInput > 0 && productoInput != ''){
        producto = obtenerProductoPorId(productoInput);
        let { precio, impuesto } = producto;
        document.getElementById(`precio${nroLinea}`).innerHTML = precio;
        document.getElementById(`impuesto${nroLinea}`).innerHTML = impuesto;
        document.getElementById(`subtotal${nroLinea}`).innerHTML = cantidadInput * precio * (1 + impuesto / 100);
    }  
    if(cantidadInput <= 0 || productoInput == ''){
        document.getElementById(`precio${nroLinea}`).innerHTML = 0;
        document.getElementById(`impuesto${nroLinea}`).innerHTML = 0;
        document.getElementById(`subtotal${nroLinea}`).innerHTML = 0;
    }

    total += parseInt(document.getElementById(`subtotal${nroLinea}`).innerHTML);
    totalElement.innerHTML = total;
}

confirmarElement.addEventListener("click", gestionarConfirmar);
cancelarElement.addEventListener("click", reinciarForm)
tipoDocumentoElement.addEventListener("change", gestionarNumero);
centroEmisorElement.addEventListener("change", gestionarNumero);
cantidad1Element.addEventListener("focusout", () => gestionarLineaDetalle(1));
producto1Element.addEventListener("change", () => gestionarLineaDetalle(1));
cantidad2Element.addEventListener("focusout", () => gestionarLineaDetalle(2));
producto2Element.addEventListener("change", () => gestionarLineaDetalle(2));
cantidad3Element.addEventListener("focusout", () => gestionarLineaDetalle(3));
producto3Element.addEventListener("change", () => gestionarLineaDetalle(3));
cantidad4Element.addEventListener("focusout", () => gestionarLineaDetalle(4));
producto4Element.addEventListener("change", () => gestionarLineaDetalle(4));
cantidad5Element.addEventListener("focusout", () => gestionarLineaDetalle(5));
producto5Element.addEventListener("change", () => gestionarLineaDetalle(5));