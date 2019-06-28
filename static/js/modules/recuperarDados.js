import {criarPropriedades} from "./propriedades.js";

export function setPageIcon(url){
	let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = url
    document.getElementsByTagName('head')[0].appendChild(link);  
}

export function recuperarDadosPainel(){
	let url= window.location.href.split("/")
	let id=url[url.length-1]
	var data=new Object()
	data.id=id
	let bd;
	let cena;
	url='/pegarMundo/'
	 $.ajax({
        type: 'POST',
        url:url, 
        data:data,
        async: false

    }).done(function(msg){
        bd=msg;
    });

    url='/pegarCena/'
	 $.ajax({
        type: 'POST',
        url:url, 
        data:data,
        async: false

    }).done(function(msg){
        cena=msg;
    });

	let Dados = new Object();
	Dados.icon = bd["icon"];
	Dados.num_imagens = bd["num_imagens"];
	Dados.num_textos = bd["num_textos"];
	Dados.num_videos = bd["num_videos"];
	Dados.num_musicas = bd["num_musicas"];
	Dados.num_galerias = bd["num_galerias"];
	Dados.galerias = JSON.parse(JSON.stringify(bd["galerias"]));	

	if (Dados.num_imagens == null || Dados.num_imagens == "undefined") { 
		Dados.num_imagens = 0; 
	}
	if (Dados.num_textos == null || Dados.num_textos == "undefined") { 
		Dados.num_textos = 0; 
	}
	if (Dados.num_videos == null || Dados.num_videos == "undefined") { 
		Dados.num_videos = 0; 
	}
	if (Dados.num_musicas == null || Dados.num_musicas == "undefined") { 
		Dados.num_musicas = 0; 
	}
	if (Dados.num_galerias == null || Dados.num_galerias == "undefined") { 
		Dados.num_galerias = 0; 
	}
	if (Dados.galerias == null || Dados.galerias == "undefined") { 
		Dados.galerias = {}; 
	}

	Dados.backgroundTexture = cena["backgroundTexture"];	
	Dados.backgroundColor = cena["backgroundColor"];

	if(Dados.backgroundTexture != '' && Dados.backgroundTexture != null && Dados.backgroundTexture != "null" && Dados.backgroundTexture != "undefined"){
		let background = document.querySelector("#fundo");
		background.style.backgroundImage = "url(\"../static/Sprites/floor_textures/" + Dados.backgroundTexture + "\")";
		background.style.backgroundColor = "none";
	}
	
	if(Dados.backgroundColor != '' && Dados.backgroundColor != null && Dados.backgroundColor != "null" && Dados.backgroundColor != "undefined"){
		let background = document.querySelector("#fundo");
		background.style.backgroundImage = "none";
		background.style.backgroundColor = Dados.backgroundColor;
	}

	Dados.floorTexture = cena["floorTexture"];
	if(Dados.floorTexture != '' && Dados.floorTexture != null && Dados.floorTexture != "null" && Dados.floorTexture != "undefined"){	
		let chao = document.getElementById("chao");
		chao.style.backgroundImage = "url(\"../static/Sprites/floor_textures/" + Dados.floorTexture + "\")";
	}
	let mundo = document.querySelector("#mundo");
	for (let i = 1; i <= Number(Dados.num_imagens); i++) {
		let objeto = document.createElement("img");
		mundo.appendChild(objeto);
		objeto.outerHTML = bd["imagem_"+i+"_outerHTML"];
		objeto.innerHTML = bd["imagem_"+i+"_innerHTML"];
		objeto.addEventListener('click', criarPropriedades);
	}
	for (let i = 1; i <= Number(Dados.num_textos); i++) {
		let objeto = document.createElement("textarea");
		mundo.appendChild(objeto);
		objeto.outerHTML = bd["texto_"+i+"_outerHTML"];
		objeto.innerHTML = bd["texto_"+i+"_innerHTML"];
		objeto.addEventListener('click', criarPropriedades);
	}
	for (let i = 1; i <= Number(Dados.num_videos); i++) {
		let objeto = document.createElement("video");
		mundo.appendChild(objeto);
		objeto.outerHTML = bd["video_"+i+"_outerHTML"];
		objeto.innerHTML = bd["video_"+i+"_innerHTML"];
		objeto.addEventListener('click', criarPropriedades);
	}
	for (let i = 1; i <= Number(Dados.num_musicas); i++) {
		let objeto = document.createElement("audio");
		mundo.appendChild(objeto);
		objeto.outerHTML = bd["musica_"+i+"_outerHTML"];
		objeto.innerHTML = bd["musica_"+i+"_innerHTML"];
		objeto.addEventListener('click', criarPropriedades);
	}
	for (let i = 1; i <= Number(Dados.num_galerias); i++) {
		let objeto = document.createElement("div");
		mundo.appendChild(objeto);
		objeto.outerHTML = bd["galeria_"+i+"_outerHTML"];
		objeto.innerHTML = bd["galeria_"+i+"_innerHTML"];
		objeto.addEventListener('click', criarPropriedades);
	}

	Dados.myPage = localStorage.getItem("myPage");
	if (Dados.myPage == null || Dados.myPage == "undefined") { 
		Dados.myPage = true; 		
	}
	else if (Dados.myPage == "true"){
		Dados.myPage = true; 
	}
	else if (Dados.myPage == "false"){
		Dados.myPage = false; 
	}

	if(Dados.myPage){
		if(Dados.icon != null && Dados.icon != "null" && Dados.icon != "undefined"){
			setPageIcon(Dados.icon);
		}
	}
	return Dados;
}

export function recuperarDadosCena(){
	let Dados = new Object();
	let url= window.location.href.split("/")
	let idMundo=url[url.length-1]
	let data=new Object()
	data.id=idMundo
	let CorAlienMundo;
	let nomeAlienMundo,nomeAlienUsuario="VISITANTE";
	
	url='/pegarcormundo/'
	$.ajax({
        type: 'POST',
        url:url, 
        data:data,
        async: false

    }).done(function(msg){
        CorAlienMundo=msg.alien;
        nomeAlienMundo=msg.usuario;
    });
    
	let cookie=document.cookie.split(";")
	let idUsuario=-1;
	let CorAlienUsuario;
	let user;
	for (var i =cookie.length - 1; i >= 0; i--) {
		if(cookie[i].indexOf("usuario")!=-1){
			user=cookie[i].split("=")
			idUsuario=user[1]
		}
	}

	if(idUsuario>-1){
		url='/pegarcorusuario/'
		data.id=idUsuario
		$.ajax({
        type: 'POST',
        url:url, 
        data:data,
        async: false
    	}).done(function(msg){
        	CorAlienUsuario=msg.alien;
        	nomeAlienUsuario=msg.usuario;
    	});
	}
	let alienMundo=document.getElementById("userCharacter")
	let alienVisitante=document.getElementById("visitorCharacter")
	
	Dados.userColor=CorAlienUsuario;
	let visitanteCadatrado=false;
	if(idUsuario==-1||idUsuario==undefined){
		Dados.userColor=CorAlienMundo;
		Dados.visitorColor = "green";
		Dados.myPage=false;
		alienVisitante.title="VISITANTE";
		alienMundo.title=nomeAlienMundo;
		data.visitante=1
	}
	else if(idUsuario==idMundo){
		Dados.visitorColor = null;
		Dados.myPage=true;
		alienVisitante.title=""
		data.visitante=0;
		alienMundo.title=nomeAlienMundo;
	}else{
		Dados.userColor=CorAlienMundo;
		Dados.visitorColor=CorAlienUsuario;
		Dados.myPage=false;
		alienVisitante.title=nomeAlienUsuario;
		alienMundo.title=nomeAlienMundo;
		data.visitante=1
	}
	let visitas=0;
	let estado="";
	data.id=idMundo
	url='/visita'
	$.ajax({
        type: 'POST',
        url:url, 
        data:data,
        async: false

    }).done(function(msg){
    	visitas=msg.visitas
		estado=msg.estado
    });
	
	let vis=document.getElementById("poster_2")
	let est=document.getElementById("cow")
	vis.title="VISITAS="+visitas
	est.title="EU ESTOU "+estado
	Dados.visitas=visitas
	return Dados;
}