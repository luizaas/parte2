let direita, esquerda;

export function initGaleria(galerias){
	direita = document.querySelectorAll(".seta-direita-galeria");
	esquerda = document.querySelectorAll(".seta-esquerda-galeria");
	for (let i = 0; i < direita.length; i++) {
	  direita[i].addEventListener('click',proximaImgemDireita(galerias));
	  esquerda[i].addEventListener('click',proximaImgemEsquerda(galerias));
	}
}

export function proximaImgemDireita(e, galerias){
	let id_galeria = this.parentNode.id;
	let value_galeria = this.parentNode.getAttribute("data-value"); //imagem atual
	let img = this.parentNode.firstElementChild;
	let tamanho_galeria = galerias[id_galeria].length-1;
	if(value_galeria==tamanho_galeria){
		value_galeria=0;
	}else{
		value_galeria++;
	}
	img.src = galerias[id_galeria][value_galeria];
	this.parentNode.setAttribute("data-value",value_galeria);
}

export function proximaImgemEsquerda(e, galerias){
	let id_galeria = this.parentNode.id;
	let value_galeria = this.parentNode.getAttribute("data-value"); //imagem atual
	let img = this.parentNode.firstElementChild;
	let tamanho_galeria = galerias[id_galeria].length-1;

	if(value_galeria==0){
		value_galeria=tamanho_galeria;
	}else{
		value_galeria--;
	}
	img.src = galerias[id_galeria][value_galeria];
	this.parentNode.setAttribute("data-value",value_galeria);
}