const api_url   = "https://pokeapi.co/api/v2/pokemon";
const searchbox = document.querySelector("#searchbox");
const searchbtn = document.querySelector("#btn");

/*//Promesa
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
}*/


const request = new Request("https://pokeapi.co/api/v2/type", {
    method: "GET"
});
show_loader()
fetch(request)
    //Promesa peticion
    .then((response) => {
        if (response.status === 200) 
        {
            return response.json();
        } else 
        {
            throw new Error("Something went wrong on API server!");
        }
    })
    .then((response) => {
        create_filters(response)
    })
    .catch((error) => {
        console.error(error);
    }).finally(()=>{
        hide_loader();
    });

function create_filters(response)
{
    if(typeof response == "object" && response.results != undefined)
    {
       
        const filter_container = document.querySelector("#filters");
        //let items = response.results.length;
        response.results.forEach(element => {
        let tmp = element.url;
        tmp = tmp.split("/");
        let filter = `<div class="filter ${element.name} type_${tmp[6]}" id="${element.name}" >
                        <a id="type_${tmp[6]}" href="${element.url}">${element.name.toUpperCase()}</a>
                    </div>`;
        filter_container.innerHTML +=filter
       
        });
        let items = document.querySelectorAll(".filter");
        for(let i=0;i<items.length;i++)
        {
            items[i].addEventListener("click",(e)=>
            {
                show_loader()
                e.preventDefault();
                let url         = e.target.href;
                let id          = e.target.id;
                get_pokemon_type(url,id)
            });
        }
    }
    
}

function create_card(url)
{
    //console.log(url)
    const container = document.querySelector("#list")
    var data = fetch(url).then((response)=>
        {
           // console.log(response)
            return response.json();
        }).then((response)=>
        {
            //console.log(response)
            let card = `<div class="card">
                <figure>
                    <img id="pokemon_${response.id}" src="${response.sprites.front_default}" alt="avatar">
                    <p>#${response.id}</p> 
                    <p>${response.name.toUpperCase()}</p> 
                    <a class="pokemon_details" href="${url}">Detalles</a>
                </figure>
            </div>`  
        
        container.innerHTML += card;
        }).catch((Error)=>
            {
               console.log(Error)
               console.log(response)
            })
    
    
    //cargamos la imagen
   
    //añadimos el template al contendor
  
}

async function get_pokemon_type(url,id) 
{
    let filters = document.querySelectorAll(".filter");
    let typeid  = "";
    console.log(filters)
    for(let i =0;i<filters.length;i++)
    {   
        filters[i].classList.remove("selected_filter");
        if(filters[i].classList.contains(id))
        {
            console.log("la encontre")
            filters[i].classList.add("selected_filter");
            typeid = filters[i].id;
        }
    }
    let data = await fetch(url);
    data     = await data.json();
    //console.log(data.pokemon);
    hide_loader()
    const container = document.querySelector("#list")
    let count = `<div class="count">${ data.pokemon.length} POKEMON ${typeid.toUpperCase()} ENCONTRADOS</div>`;
    container.innerHTML +=count;
    data.pokemon.forEach((poke)=>
    {
        //console.log(poke)
        create_card(poke.pokemon.url)
    })
    
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
        //console.log(response)
        create_card(response.pokemon.url)
        //segunda promesa con la informacion convertida a JSON
        //console.log(response.sprites)
       /* let image_uri   = response.sprites.front_default;
        if(image_uri != undefined)
        {
            const img       = document.querySelector("#pokemon_"+id)
            img.src         = image_uri;
            //return response.sprites.front_default;
        }*/
        
    });
}



//Async / Await
async function default_data()
{
   // show_loader();
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
        localStorage.setItem("listado",JSON.stringify(data));
        let storage = localStorage.getItem("listado");
        console.log(storage)
        create_list(data)
    }catch(error)
    {
        console.log(error)
        //hide_loader()
    }
    
}

function create_list(data)
{
   // hide_loader(); 
    //Obtener el contenedor
     const container = document.querySelector("#list");
     container.innerHTML = "";
     //console.log(container)
     //contar elementos en la respuesta
     let items       = Object.keys(data.results).length
     //console.log("se encontrarion "+items+" Pokemons")
     //recorremos el objeto para crear los elementos
     //hide_loader();
     for(let i=0;i<items;i++)
     {
        let pokemon =  data.results[i];
        create_card(pokemon.url)        
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
    
    //.log("buuacr")
    const container = document.querySelector("#list");
    let value       = searchbox.value;
    container.innerHTML = "";
    if(value!="")
    {   
       // show_loader();
      //  console.log("buuacr")
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
           // console.log(response)
            let card = `<div class="card">
                            <figure>
                                <img id="pokemon_${response.id}" src="${response.sprites.front_default}" alt="avatar">
                                <p>#${response.id}</p> 
                                <p>${response.name.toUpperCase()}</p> 
                                <a class="pokemon_details" href="${api_url+"/"+response.id}">Detalles</a>
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


function show_loader()
{
    const container = document.querySelector("#list");
    var loader = `<div class="loader"><img class="imgloader" src="img/Pokeball-PNG-Free-Download.png"/></div>`;
    container.innerHTML = loader;
}

function hide_loader()
{
    const container = document.querySelector("#list");
    container.innerHTML = "";
}