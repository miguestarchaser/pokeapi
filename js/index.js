const api_url   = "https://pokeapi.co/api/v2/pokemon";
const searchbox = document.querySelector("#searchbox");
const searchbtn = document.querySelector("#btn");

//Promesa
function request(uri,metod)
{
    //METODOS HTTP
    //GET, POST, PUT, DELETE, 
    const request = new Request(uri, {
        method: metod
    });
    fetch(request)
        .then((response) => {
            console.log(response)
            if (response.status === 200) 
            {
                console.log("primera promesa")
                console.debug(response)
                return response.json();
            } else 
            {
                throw new Error("Something went wrong on API server!");
            }
        })
        .then((response) => {
            console.log("segunda promesa")
            console.debug(response);
            return response;
        })
        .catch((error) => {
            console.error(error);
        });
}

function load_images(uri,id){
    //pedir los datos del pokemon
    fetch(uri)
    .then((response) => {
        //primera promesa con la respuesta del servidor
        if (response.status === 200) 
        {
            return response.json();
        }
    })
    .then((response) => {
        //segunda promesa con la informacion convertida a JSON
        //console.log(response.sprites)
        let image_uri   = response.sprites.front_default;
        const img       = document.querySelector("#pokemon_"+id)
        img.src         = image_uri;
        //return response.sprites.front_default;
    });
}

//Async / Await
async function default_data()
{
    try
    {
        //lanzamos peticion a la API
        let response = await fetch(api_url+"?limit=150");
        //console.log(response)
        //validamos la respuesta del servidor
        if(!response.ok)
        {
            //si es un error, cachamos la excepcion
            throw new Error("No se pudieron obtener los datos")    
        }
        //Cargamos como JSON y esperamos a que la promesa termine
        const data = await response.json();
        //console.log(data)
        create_list(data)
    }catch(error)
    {
        console.log(error)
    }
    
}

function create_list(data)
{
     //Obtener el contenedor
     const container = document.querySelector("#list");
     //console.log(container)
     //contar elementos en la respuesta
     let items       = Object.keys(data.results).length
     console.log("se encontrarion "+items+" Pokemons")
     //recorremos el objeto para crear los elementos
     for(let i=0;i<=items;i++)
     {
         //console.log(data.results[i])
         let pokemon = data.results[i];
         let number  = (i+1);
        
         //creamos el template para cada elemento
         let card = `<div class="card">
                         <figure>
                             <img id="pokemon_${number}" src="img/Pokeball-PNG-Free-Download.png" alt="avatar">
                             <p>#${number}</p> 
                             <p>${pokemon.name.toUpperCase()}</p> 
                             <a href="${pokemon.url}">Detalles</a>
                         </figure>
                     </div>`  
         //cargamos la imagen
         let img   = load_images(pokemon.url,number)
        //añadimos el template al contendor
         container.innerHTML += card;
     }
}

default_data();

searchbox.addEventListener("keydown",(e)=>
{
    let value       = searchbox.value;
    if(value=="")
    {  
        const container = document.querySelector("#list");
        container.innerHTML = "";
        default_data();
    }
});

searchbtn.addEventListener("click",(e)=>
{
    console.log("buuacr")
    const container = document.querySelector("#list");
    let value       = searchbox.value;
    container.innerHTML = "";
    if(value!="")
    {   
       
        console.log("buuacr")
        fetch(api_url+"/"+value).then((response) => {
            if (response.status === 200) 
            {
                return response.json();
            } else 
            {
                throw new Error("Something went wrong on API server!");
            }
        })
        .then((response) => {
            console.log(response)
            let card = `<div class="card">
                            <figure>
                                <img id="pokemon_${response.id}" src="${response.sprites.front_default}" alt="avatar">
                                <p>#${response.id}</p> 
                                <p>${response.name.toUpperCase()}</p> 
                                <a href="${api_url+"/"+response.id}">Detalles</a>
                            </figure>
                        </div>`
            //añadimos el template al contendor
            container.innerHTML += card;
        })
        .catch((error) => {
            console.error(error);
        });
        
    }else
    {
        default_data();
    }
});