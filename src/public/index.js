document.addEventListener('submit',sendForm);

function sendForm(e){
    e.preventDefault();
    let form= document.getElementById('prodForm');
    let data = new FormData(form);
    fetch('/api/products',{
        method:'POST',
        body:data
    }).then(result=>{
        return result.json();
    }).then(json=>{
        Swal.fire({
            title:'Producto Creado',
            text:json.message,
            icon:'success',
            timer:3000,
        }).then(result=>{
            // location.href='/'
        })
    })
}

document.getElementById("thumbnail").onchange = (e)=>{
    let read = new FileReader();
    read.onload = e =>{
        document.querySelector('.image-text').innerHTML = "¡A subir la imagen ;)!"
        document.getElementById("preview").src = e.target.result;
    }
    
    read.readAsDataURL(e.target.files[0])
}

const socket = io(); //instanciamos io

socket.on('getProd',data=>{
    let products = data.payload;
    fetch('templates/productsTables.handlebars').then(string=>string.text()).then(template=>{
        const processTemplate = Handlebars.compile(template);
        const templateObj={
            products:products
        }   
        const html = processTemplate(templateObj);
        let div = document.getElementById('productsTables');
        div.innerHTML=html;
    })
})



//Chat
let input = document.getElementById('messages');
let user = document.getElementById('email');
input.addEventListener('keyup',(e)=>{
    if(e.key==="Enter"){
        if(e.target.value){
            socket.emit('message',{user:email.value,message:e.target.value});
        }
    }
})

socket.on('messlog', data=>{
    let m = document.getElementById('log');
    let messages = data.map(message=>{
        return `<div><span>${message.email} dice: ${message.message}</span></div>`
    }).join('');
    m.innerHTML=messages;
})


function setDate(){
    d = new Date()
    if (m != d.getMinutes()) {
        m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
    }
}