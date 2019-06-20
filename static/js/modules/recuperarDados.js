import {criarPropriedades} from "./propriedades.js";

export function setPageIcon(url){
	let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = url
    document.getElementsByTagName('head')[0].appendChild(link);  
    //console.log(document.getElementsByTagName('head')[0])  
    //console.log(link)
}

export function recuperarDadosPainel(){
	let url= window.location.href.split("/")
	let id=url[url.length-1]
	var data=new Object()
	
	data.id=id
	let bd;
	let cena;
	//console.log(data)
	url='/pegarMundo/'
	 $.ajax({
        type: 'POST',
        url:url, 
        data:data,
        async: false

    }).done(function(msg){
    	console.log("MUNDO RETORNADO PELO NODE")
       // console.log(msg); // log here 
        bd=msg;
    });
    url='/pegarCena/'
	 $.ajax({
        type: 'POST',
        url:url, 
        data:data,
        async: false

    }).done(function(msg){
    	console.log("CENA RETORNADO PELO NODE")
        //console.log(msg); // log here 
        cena=msg;
    });
    console.log(bd)
    console.log(cena)
	let Dados = new Object();
	Dados.icon = bd["icon"];
	//console.log(Dados.icon)

	Dados.num_imagens = bd["num_imagens"];
	Dados.num_textos = bd["num_textos"];
	Dados.num_videos = bd["num_videos"];
	Dados.num_musicas = bd["num_musicas"];
	Dados.num_galerias = bd["num_galerias"];
	Dados.galerias=null
	//Dados.galerias = JSON.parse(bd["galerias"]);	
	//Dados.icon = localStorage.getItem("icon");
	//console.log(Dados)
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

	if(Dados.backgroundTexture != null && Dados.backgroundTexture != "null" && Dados.backgroundTexture != "undefined"){
		let background = document.querySelector("#fundo");
		background.style.backgroundImage = "url(\"../static/Sprites/floor_textures/" + Dados.backgroundTexture + "\")";
		//console.log("url(\"../static/Sprites/floor_textures/" + Dados.backgroundTexture + "\")")
		background.style.backgroundColor = "none";
	}
	
	if(Dados.backgroundColor != null && Dados.backgroundColor != "null" && Dados.backgroundColor != "undefined"){
		let background = document.querySelector("#fundo");
		background.style.backgroundImage = "none";
		background.style.backgroundColor = Dados.backgroundColor;
	}

	Dados.floorTexture = cena["floorTexture"];
	if(Dados.floorTexture != null && Dados.floorTexture != "null" && Dados.floorTexture != "undefined"){	
		let chao = document.getElementById("chao");
		chao.style.backgroundImage = "url(\"../static/Sprites/floor_textures/" + Dados.floorTexture + "\")";
	}
	//console.log(Dados)
	let mundo = document.querySelector("#mundo");
	for (let i = 1; i <= Number(Dados.num_imagens); i++) {
		let objeto = document.createElement("img");
		mundo.appendChild(objeto);
		objeto.outerHTML = bd["imagem_"+i+"_outerHTML"];
		objeto.innerHTML = bd["imagem_"+i+"_innerHTML"];
		objeto.addEventListener('click', criarPropriedades);
		/*console.log("IMG")
		console.log(objeto)
		console.log("MUNDO")
		console.log(mundo)*/
	}
	for (let i = 1; i <= Number(Dados.num_textos); i++) {
		let objeto = document.createElement("textarea");
		mundo.appendChild(objeto);
		objeto.outerHTML = bd["texto_"+i+"_outerHTML"];
		objeto.innerHTML = bd["texto_"+i+"_innerHTML"];
		/*console.log("TEXTO")
		console.log(objeto)
		console.log("MUNDO")
		console.log(mundo)*/
		objeto.addEventListener('click', criarPropriedades);
	}
	for (let i = 1; i <= Number(Dados.num_videos); i++) {
		let objeto = document.createElement("video");
		mundo.appendChild(objeto);
		objeto.outerHTML = bd["video_"+i+"_outerHTML"];
		objeto.innerHTML = bd["video_"+i+"_innerHTML"];
		/*console.log("VIDEO")
		console.log(objeto)
		console.log("MUNDO")
		console.log(mundo)*/
		objeto.addEventListener('click', criarPropriedades);
	}
	for (let i = 1; i <= Number(Dados.num_musicas); i++) {
		let objeto = document.createElement("audio");
		mundo.appendChild(objeto);
		objeto.outerHTML = bd["musica_"+i+"_outerHTML"];
		objeto.innerHTML = bd["musica_"+i+"_innerHTML"];
		/*console.log("MUSICA")
		console.log(objeto)
		console.log("MUNDO")
		console.log(mundo)*/
		objeto.addEventListener('click', criarPropriedades);
	}
	for (let i = 1; i <= Number(Dados.num_galerias); i++) {
		let objeto = document.createElement("div");
		mundo.appendChild(objeto);
		objeto.outerHTML = bd["galeria_"+i+"_outerHTML"];
		objeto.innerHTML = bd["galeria_"+i+"_innerHTML"];
		/*console.log("MUSICA")
		console.log(objeto)
		console.log("MUNDO")
		console.log(mundo)*/
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
	/*let Dados = new Object();
	Dados.icon = localStorage.getItem("icon");


	Dados.num_imagens = localStorage.getItem("num_imagens");
	Dados.num_textos = localStorage.getItem("num_textos");
	Dados.num_videos = localStorage.getItem("num_videos");
	Dados.num_musicas = localStorage.getItem("num_musicas");
	Dados.num_galerias = localStorage.getItem("num_galerias");
	Dados.galerias=null
//Dados.galerias = JSON.parse(window.localStorage.getItem("galerias"));	
	Dados.icon = localStorage.getItem("icon");

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

	Dados.backgroundTexture = localStorage.getItem("backgroundTexture");	
	Dados.backgroundColor = localStorage.getItem("backgroundColor");

	if(Dados.backgroundTexture != null && Dados.backgroundTexture != "null" && Dados.backgroundTexture != "undefined"){
		let background = document.querySelector("#fundo");
		background.style.backgroundImage = "url(\"../static/Sprites/floor_textures/" + Dados.backgroundTexture + "\")";
		background.style.backgroundColor = "none";
	}
	
	if(Dados.backgroundColor != null && Dados.backgroundColor != "null" && Dados.backgroundColor != "undefined"){
		let background = document.querySelector("#fundo");
		background.style.backgroundImage = "none";
		background.style.backgroundColor = Dados.backgroundColor;
	}

	Dados.floorTexture = localStorage.getItem("floorTexture");
	if(Dados.floorTexture != null && Dados.floorTexture != "null" && Dados.floorTexture != "undefined"){	
		let chao = document.getElementById("chao");
		chao.style.backgroundImage = "url(\"../static/Sprites/floor_textures/" + Dados.floorTexture + "\")";
	}

	let mundo = document.querySelector("#mundo");
	for (let i = 1; i <= Number(Dados.num_imagens); i++) {
		let objeto = document.createElement("img");
		mundo.appendChild(objeto);
		objeto.outerHTML = localStorage.getItem("imagem-"+i+"_outerHTML");
		objeto.innerHTML = localStorage.getItem("imagem-"+i+"_innerHTML");
		objeto.addEventListener('click', criarPropriedades);
		console.log("IMG")
		console.log(objeto)
		console.log("MUNDO")
		console.log(mundo)
	}
	for (let i = 1; i <= Number(Dados.num_textos); i++) {
		let objeto = document.createElement("textarea");
		mundo.appendChild(objeto);
		objeto.outerHTML = localStorage.getItem("texto-"+i+"_outerHTML");
		objeto.innerHTML = localStorage.getItem("texto-"+i+"_innerHTML");
		console.log("TEXTO")
		console.log(objeto)
		console.log("MUNDO")
		console.log(mundo)
		objeto.addEventListener('click', criarPropriedades);
	}
	for (let i = 1; i <= Number(Dados.num_videos); i++) {
		let objeto = document.createElement("video");
		mundo.appendChild(objeto);
		objeto.outerHTML = localStorage.getItem("video-"+i+"_outerHTML");
		objeto.innerHTML = localStorage.getItem("video-"+i+"_innerHTML");
		console.log("VIDEO")
		console.log(objeto)
		console.log("MUNDO")
		console.log(mundo)
		objeto.addEventListener('click', criarPropriedades);
	}
	for (let i = 1; i <= Number(Dados.num_musicas); i++) {
		let objeto = document.createElement("audio");
		mundo.appendChild(objeto);
		objeto.outerHTML = localStorage.getItem("musica-"+i+"_outerHTML");
		objeto.innerHTML = localStorage.getItem("musica-"+i+"_innerHTML");
		console.log("MUSICA")
		console.log(objeto)
		console.log("MUNDO")
		console.log(mundo)
		objeto.addEventListener('click', criarPropriedades);
	}
	for (let i = 1; i <= Number(Dados.num_galerias); i++) {
		let objeto = document.createElement("div");
		mundo.appendChild(objeto);
		objeto.outerHTML = localStorage.getItem("galeria-"+i+"_outerHTML");
		objeto.innerHTML = localStorage.getItem("galeria-"+i+"_innerHTML");
		console.log("MUSICA")
		console.log(objeto)
		console.log("MUNDO")
		console.log(mundo)
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
	}*/
	console.log(Dados)
	return Dados;
}

export function recuperarDadosCena(){
	let Dados = new Object();
	let url= window.location.href.split("/")
	let idMundo=url[url.length-1]
	console.log(idMundo)
	var data=new Object()
	data.id=idMundo
	let CorAlienMundo;

	url='/pegarcormundo/'
	$.ajax({
        type: 'POST',
        url:url, 
        data:data,
        async: false

    }).done(function(msg){
    	console.log("COR DO ALIEN DO MUNDO")
        CorAlienMundo=msg;
        console.log(CorAlienMundo)
    });
    
    


	let cookie=document.cookie.split(";")
	console.log(cookie)
	let idUsuario=-1;
	let CorAlienUsuario;
	let user;
	for (var i =cookie.length - 1; i >= 0; i--) {
		console.log(cookie[i])
		console.log(cookie[i].indexOf("usuario"))
		if(cookie[i].indexOf("usuario")!=-1){
			user=cookie[i].split("=")
			idUsuario=user[1]
			console.log("USER ATUAL: "+idUsuario)
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
    		console.log("COR DO ALIEN DO USUARIO")
        	CorAlienUsuario=msg;
        	console.log(CorAlienUsuario)
    	});
	}

	Dados.userColor=CorAlienUsuario;

	if(idUsuario==-1||idUsuario==undefined){
		Dados.userColor=CorAlienMundo;
		Dados.visitorColor = "green";
		Dados.myPage=false;
	}
	else if(idUsuario==idMundo){
		Dados.visitorColor = null;
		Dados.myPage=true;
	}else{
		Dados.userColor=CorAlienMundo;
		Dados.visitorColor=CorAlienUsuario;
		Dados.myPage=false;
	}
	//Dados.userColor="blue"
	//Dados.visitorColor="blue"
	console.log(Dados)

	return Dados;
}