export function salvarDadosPortifolio(Dados){
	var data=new Object()
	let url= window.location.href.split("/")
	data.id=url[url.length-1]
	let widgets = document.querySelector("#widgets");
	let objeto = document.querySelectorAll(".objeto");

	for (let i = 0; i < widgets.length; i++) {
			widgets[i].style.display = "none";
	}
	for (let i = 0; i < objeto.length; i++) {
		if(objeto[i].id.startsWith("texto")) objeto[i].innerHTML = objeto[i].value;
		if(objeto[i].id.startsWith("video")) objeto[i].firstChild.style.pointerEvents = "none";
		if(objeto[i].id.startsWith("musica")) objeto[i].firstChild.style.pointerEvents = "none";
		objeto[i].classList.remove("resize-drag")
		var nome = objeto[i].id+"_outerHTML"
		nome = nome.replace("-","_")
		data[nome]=objeto[i].outerHTML
		nome = objeto[i].id+"_innerHTML"
		nome = nome.replace("-","_")
		data[nome]=objeto[i].innerHTML
    }
	data.galerias=JSON.stringify(Dados.galerias)
	data.num_textos=Dados.num_textos
	data.num_imagens=Dados.num_imagens
    data.num_videos=Dados.num_videos
    data.num_musicas=Dados.num_musicas
    data.num_galerias=Dados.num_galerias
    data.icon=Dados.icon

    $.ajax({
        type: 'POST',
        url: '/salvarmundo', 
        data: data
    }).done(function(msg){
    	//Isso estava funcionando mas parou do nada
    	//mas que devia funciona devia
    	let aviso = document.getElementById("aviso")
    	aviso.innerText="Salvo!"
    	let a = setTimeout(()=> {
			let aviso = document.getElementById("aviso")
			aviso.innerText=""
		}, 1000)
    });
}

export function salvarDadosCena(Dados){
	var data=new Object()
	let url= window.location.href.split("/")
	data.id=url[url.length-1]
	data.backgroundTexture=Dados.backgroundTexture
	data.backgroundColor=Dados.backgroundColor
	data.floorTexture=Dados.floorTexture
	data.alien=Dados.userColor
	$.ajax({
        type: 'POST',
        url: '/salvarcena', 
        data: data
    }).done(function(msg){
    	//Isso estava funcionando mas parou do nada
    	//mas que devia funciona devia
    	let aviso = document.getElementById("aviso")
    	aviso.innerText="Salvo!"
    	let a = setTimeout(()=> {
			let aviso = document.getElementById("aviso")
			aviso.innerText=""
		}, 1000)
    });
}


