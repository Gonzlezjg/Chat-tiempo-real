const botones = document.querySelector('#botones')
const nombreUser = document.querySelector('#nombreUser')
const contentProtect = document.querySelector('#contentProtect')
const form = document.querySelector('#form')
const inputChat = document.querySelector('#inputChat')
const imgUser = document.querySelector('#imgUser')

firebase.auth().onAuthStateChanged(user => {

    if (user) {
      //datos del usuario
      console.log(user)
      botones.innerHTML = /*html*/`
      <button class="btn btn-outline-warning text-white" id="btnCerrar">Cerrar Sesion</button>
      `;
      
      nombreUser.innerHTML = user.displayName;
      
      form.classList= 'input-group py-2 position-relative fixed-bottom container';

      contenido(user)
      cerrarSesion();

    } else {

      botones.innerHTML = /*html*/`
      <button class="btn bg-success text-white" id="btnAcceder">Acceder</button>
      `;

      contentProtect.innerHTML = /*html*/`
      <main id="contentProtect">
          <p class="text-center font-weight-bold lead mt-5 shadow p-3 mb-5 bg-white rounded">
          <i class="far fa-comments"></i>
            Inicia Sesion para acceder al chat!
          </p>
      </main>
      `;

      nombreUser.innerHTML = "Firechat";
      imgUser.src = "";
      form.classList.add('d-none');
      iniciarSesion();
    }

  });


 //Funciones para cerrar e iniciar sesion
  const cerrarSesion = () =>{
    const btnCerrar = document.querySelector('#btnCerrar');
    btnCerrar.addEventListener('click', ()=>{
      firebase.auth().signOut()
    })
  }


  const iniciarSesion = () => {
      const btnAcceder = document.querySelector('#btnAcceder');
      btnAcceder.addEventListener('click', async() => {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                await firebase.auth().signInWithPopup(provider);
            } catch (error) {
                console.error('error')
            }
      })
  };

  const contenido = (user) => {
    let photoURL = user.photoURL;
    let displayName = user.displayName;
    const bienvenida = document.createElement("p"); 
    const cargando = document.createElement("div")

    bienvenida.innerHTML = /*html*/`<p class="text-center mt-5 lead">Bienvenido ${displayName}</p>
      `;
    cargando.innerHTML = /*html*/`
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    `;
  
    imgUser.src = photoURL;
    contentProtect.append(bienvenida)
    contentProtect.append(cargando)
    //formulario
    form.addEventListener('submit',(e) => {
      e.preventDefault();
      
      if(!inputChat.value.trim()){
        console.log('input vacio')
        return
      }
      
      firebase.firestore().collection('chat').add({
        texto: inputChat.value,
        uid: user.uid,
        fecha: Date.now(),
      })
        .then(res => {console.log('Mensaje Guardado')})
        .catch(e => console.error(e))

      inputChat.value  = "";
    })


    firebase.firestore().collection('chat').orderBy('fecha').onSnapshot(query => {

        contentProtect.innerHTML = "";
        query.forEach(doc => {
          console.log(doc.data())
          if(doc.data().uid === user.uid){

            contentProtect.innerHTML += /*html*/`<div class="d-flex justify-content-end">
            <p class="font-weight-normal  badge-primary px-3 rounded-pill
            text-break">${doc.data().texto}</p> 
            </div>
              `;
          }else{

            contentProtect.innerHTML += /*html*/`
            <div class="d-flex justify-content-start">
            <p class="font-weight-normal  badge-secondary text-wrap px-3 rounded-pill text-break">${doc.data().texto}</p>
            </div>
              `;

          }
          contentProtect.scrollTop = contentProtect.scrollHeight;
        })
      })


  }

  