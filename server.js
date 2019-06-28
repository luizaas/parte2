const express =require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient = require('mongodb').MongoClient 
const uri = "mongodb+srv://user1:senha@cluster0-jfusq.gcp.mongodb.net/test?retryWrites=true&w=majority"
const mongoose = require('mongoose');
const session = require('express-session');
const cookie = require('cookie-parser');

app.set('view engine','ejs')
app.use(cookie());
app.use('/static', express.static('static')) //NAO TOQUE
app.use(bodyParser.urlencoded({extended:true}))

var ObjectID = require('mongodb').ObjectID;

MongoClient.connect(uri,(err,client)=>{
	if(err) return console.log(err)
	bd=client.db("craft")
	app.listen(3000,function(){
		console.log("running in 3000")
	})
})

app.get('/', (req, res) => {
    var usuario = bd.collection('usuario').find() //nao sei se é necessario 
    var usuario = bd.collection('mundo').find()
    res.redirect('/login')
    
})

app.get('/show', (req, res) => { //cata do bd
    bd.collection('usuario').find().toArray((err, results) => {
    	 if (err) return console.log(err)
		res.render('show.ejs', { data: results })
    })
})
app.get('/login', (req, res) => { //pagina do login
	if(req.cookies.usuario==''||req.cookies.usuario==undefined){
		console.log("Nao tem user ainda")
		res.render('index.ejs')
	}else{
		var usuario = req.cookies.usuario
		console.log("Tem user: "+usuario)
		res.redirect("/mundo/"+usuario);
	}
})
app.get('/logout', (req, res) => { //logout
	res.cookie("usuario","")
    res.redirect('/login')
})

app.post('/login', (req, res) => { //fazer login
	console.log("LOGIN")
	var query = { usuario: req.body.usuario };
	bd.collection('usuario').find(query)
	.toArray((err, result) => {
       if (err) return console.log(err)
       if(result.length==0) {
       		res.redirect('/erro/Nao existe o usuario')
	       	return;
   		}
		if(result[0].senha==req.body.senha){
			console.log("Senha correta")
			res.cookie("usuario",result[0].id);
			res.redirect("/mundo/"+result[0].id);
		}
		else{
			console.log("Senha errada")
			res.redirect('/erro/Senha Errada')
		}
	})
})
/*function pegarMundoBD(id){
	console.log("PEGAR MUNDO")
	let query = { id: parseInt(id) };
	bd.collection('mundo').find(query).toArray((err, result) => {
	       if (err) return console.log(err)
	       if(result.length==0) {
		       	console.log("ERRO")
		        return;
	   		}
	   		result=result[0]
	   		html="<div id=\"mundo\" class=\"resize-container\"> "
	   		for (let i = 1; i <= parseInt(result["num_imagens"]); i++) {
				outerHTML=result["imagem_"+i+"_outerHTML"]
				outerHTML=outerHTML.replace("<img ","<img onclick=\"criarPropriedades() \"")
				html+=outerHTML
			}
			for (let i = 1; i <= parseInt(result["num_textos"]); i++) {
				outerHTML=result["texto_"+i+"_outerHTML"]
				innerHTML=result["texto_"+i+"_innerHTML"]
				outerHTML=outerHTML.replace("<textarea ","<textarea onclick=\"criarPropriedades() \"")
				html+=outerHTML
			}

			for (let i = 1; i <= parseInt(result["num_videos"]); i++) {
				outerHTML=result["video_"+i+"_outerHTML"]
				innerHTML=result["video_"+i+"_innerHTML"]
				outerHTML=outerHTML.replace("<div ","<div onclick=\"criarPropriedades() \"")
				html+=outerHTML
			}
			
			for (let i = 1; i <= parseInt(result["num_musicas"]); i++) {
				outerHTML=result["musica_"+i+"_outerHTML"]
				innerHTML=result["musica_"+i+"_innerHTML"]
				outerHTML=outerHTML.replace("<div ","<div onclick=\"criarPropriedades() \"")
				html+=outerHTML
			}
			
			for (let i = 1; i <= parseInt(result["num_galerias"]); i++) {
				outerHTML=result["galeria_"+i+"_outerHTML"]
				innerHTML=result["galeria_"+i+"_innerHTML"]
				outerHTML=outerHTML.replace("<div ","<div onclick=\"criarPropriedades() \"")
				html+=outerHTML
			}

			html+="</div>"
	   		let htmlMundo=html
	})
}*/

app.post("/pegarMundo/",(req,res)  =>{
	let id= req.body.id
	console.log("PEGAR MUNDO")
	let query = { id: parseInt(id) };
	bd.collection('mundo').find(query)
		.toArray((err, result) => {
	       if (err) return console.log(err)
	       if(result.length==0) {
	       		res.send("Erro")
		        return;
	   		}
	   		res.send(result[0])
	   	})

})
app.post("/pegarCena/",(req,res)  =>{
	let id= req.body.id
	console.log("PEGAR CENA")
	let query = { id: parseInt(id) };
	bd.collection('cena').find(query)
		.toArray((err, result) => {
	       if (err) return console.log(err)
	       if(result.length==0) {
	       		res.send("ERRO")
		        return;
	   		}
	   		res.send(result[0])
	   	})
})
app.post("/pegarcorusuario/",(req,res)  =>{
	let id= req.body.id
	console.log("PEGAR COR USUARIO")
	let query = { id: parseInt(id) };
	bd.collection('usuario').find(query)
		.toArray((err, result) => {
	       if (err) return console.log(err)
	       if(result.length==0) {
	       		res.send("blue")
		        return;
	   		}
	   		res.send(result[0].alien)
	   	})

})
app.post("/pegarcormundo/",(req,res)  =>{
	let id= req.body.id
	console.log("PEGAR COR MUNDO")
	let query = { id: parseInt(id) };
	bd.collection('cena').find(query)
		.toArray((err, result) => {
	       if (err) return console.log(err)
	       if(result.length==0) {
	       		res.send("blue")
		        return;
	   		}
	   		res.send(result[0].alien)
	   	})
})
app.post("/visita",(req,res)  =>{
	console.log("VISITA")
	let idMundo= req.body.id
	let visitante=parseInt(req.body.visitante)
	let data=new Object()
	console.log(visitante)
	let visitas=0;
	let ultimasVisitas=0;
	console.log("Adiciona uma visita")
	let query = { id: parseInt(idMundo) };
	bd.collection('usuario').find(query)
		.toArray((err, result) => {
	       if (err) return console.log(err)
	       if(result.length==0) {
	       		res.send("NOPE")
		        return;
	   		}
	   		visitas=parseInt(result[0].visitasTotais)
	   		ultimasVisitas=parseInt(result[0].visitasDesdeUltimoAcesso)
	   		console.log(visitas)
	   		console.log(ultimasVisitas)

	   		//ESTADO VAQUINHA
	   		if(ultimasVisitas==0)
	   			data.estado="MOOORRENDO DE FOME!!"
	   		else if(ultimasVisitas<10)
	   			data.estado="COM MOOOITA FOME!!"
	   		else if(ultimasVisitas<25)
	   			data.estado="COM FOME!!"
	   		else if(ultimasVisitas<50)
				data.estado="SACIADA."
			else if(ultimasVisitas<100)
				data.estado="CHEIAAA E FELIZ."
			else
				data.estado="MAIS FELIZ IMOOOSIVEL!!!!"

	   		if(visitante==1){
		   		visitas+=1
		   		ultimasVisitas+=1
		   		console.log(visitas)
		   		console.log(ultimasVisitas)
		   		console.log("+1")
		   		bd.collection('usuario').updateOne(query,{
					$set:{
						visitasTotais:parseInt(visitas),
						visitasDesdeUltimoAcesso:parseInt(ultimasVisitas)
					}
				},(err,result)=>{
					if(err) return res.send(err)
					console.log("Visitas:"+visitas)
					console.log("visitasDesdeUltimoAcesso:"+ultimasVisitas)
					
				})
		   	}else{
		   		ultimasVisitas = 0;
		   		bd.collection('usuario').updateOne(query,{
					$set:{
						visitasDesdeUltimoAcesso:parseInt(ultimasVisitas)
					}
				},(err,result)=>{
					if(err) return res.send(err)
					console.log("Visitas:"+visitas)
					console.log("visitasDesdeUltimoAcesso:"+ultimasVisitas)
					
				})
		   	}
		   	data.visitas=visitas.toString()
		   	console.log(data)
		   	res.send(data)

	})

})
app.get('/mundo/:idb',(req,res)=>{
	let id= req.params.idb
	console.log("ENTRANDO NO MUNDO")
	let query = { id: parseInt(id) };
	bd.collection('usuario').find(query)
		.toArray((err, result) => {
	       if (err) return console.log(err)
	       if(result.length==0) {
	       		res.redirect('/erro/Mundo nao Existe')
		        return;
	   		}
	   		//alien=result[0].alien;
	   		/*bd.collection('mundo').find(query).toArray((err, result) => {
	      	if (err) return console.log(err)
	        if(result.length==0) {
		       	console.log("ERRO")
		        return;
	   		}*/
			res.render('mundo.ejs')   		
		//})
	   		
	})
	
})

app.get('/cadastrar', (req, res) => { //pagina do cadastro
    res.render('cadastro.ejs')
})
app.post('/cadastrar', (req, res) => { //cadastrar
    bd.collection('usuario').find().toArray((err, results) => {
       if (err) return console.log(err)
       let maior=0
   		let cadastrar=true
       for (var i= results.length - 1; i >= 0; i--) {
       		if(results[i].usuario==req.body.usuario){
       			res.redirect("/erro/Usuario já existe")
       			cadastrar=false
       			break
       		}
       		if(results[i].email==req.body.email){
       			res.redirect("/erro/Esse email ja esta sendo usado")
       			cadastrar=false
       			break
       		}
      		if(results[i].id > maior)
      			maior=results[i].id  
       }
       if(cadastrar){
		    req.body.id = parseInt(maior) +1;
		    mundo={
		    	id:req.body.id,
		    	num_galerias:0,
		    	num_imagens:0,
		    	num_musicas:0,
		    	num_textos:0,
		    	num_videos:0,
		    	galerias:{},
		    	icon:null
		    }
		    cena={
		    	id:req.body.id,
		    	backgroundTexture:"",
				backgroundColor:"",
				floorTexture:"text_1.jpeg"
		    }
		    req.body.alien="blue"
		    req.body.visitasTotais=0
		    req.body.visitasDesdeUltimoAcesso=0
		    bd.collection('usuario').save(req.body,(err,result)=>{
				if(err) return console.log(err)
				bd.collection('mundo').save(mundo,(err,result)=>{
					if(err) return console.log(err)
					console.log("Salvo no mundo")
				})
				bd.collection('cena').save(cena,(err,result)=>{
					if(err) return console.log(err)
					console.log("Salvo no cena")
				})
				console.log("Salvo no BD")
				res.redirect('/login')
			})
		}
    })
	
})

app.route('/salvarmundo').post((req,res)=>{
	console.log("SALVAR O MUNDO")
	var dados=new Object()
	dados.id = parseInt(req.body.id)
	dados.html=req.body.html
	dados.icon=req.body.icon
	dados.num_imagens=req.body.num_imagens
	dados.num_galerias=req.body.num_galerias
	dados.num_musicas=req.body.num_musicas
	dados.num_textos=req.body.num_textos
	dados.num_videos=req.body.num_videos
	dados.galerias=req.body.galerias
	dados.icon=req.body.icon
	for (let i = 1; i <= Number(dados.num_imagens); i++) {
		var nome="imagem_"+i+"_outerHTML"
		dados[nome]=req.body[nome]
		nome="imagem_"+i+"_innerHTML"
		dados[nome]=req.body[nome]
	}
	for (let i = 1; i <= Number(dados.num_textos); i++) {
		var nome="texto_"+i+"_outerHTML"
		dados[nome]=req.body[nome]
		nome="texto_"+i+"_innerHTML"
		dados[nome]=req.body[nome]
	}
	for (let i = 1; i <= Number(dados.num_videos); i++) {
		var nome="video_"+i+"_outerHTML"
		dados[nome]=req.body[nome]
		nome="video_"+i+"_innerHTML"
		dados[nome]=req.body[nome]
	}
	for (let i = 1; i <= Number(dados.num_musicas); i++) {
		var nome="musica_"+i+"_outerHTML"
		dados[nome]=req.body[nome]
		nome="musica_"+i+"_innerHTML"
		dados[nome]=req.body[nome]
	}
	for (let i = 1; i <= Number(dados.num_galerias); i++) {
		var nome="galeria_"+i+"_outerHTML"
		dados[nome]=req.body[nome]
		nome="galeria_"+i+"_innerHTML"
		dados[nome]=req.body[nome]
	}
	var query = { id: parseInt(req.body.id) };
	bd.collection('mundo').deleteOne(query)
		.then((result)=>{
			if(result.deletedCount>0){
				bd.collection('mundo').save(dados,(err,result)=>{
					if(err) return console.log(err)
					console.log("Alteraçoes salvas!")
				})
			}else{
				console.log("Deu erro e não devia dar")
			}
		}).catch(err=> console.log( res.send(500,err)))

})

app.route('/salvarcena').post((req,res)=>{
	console.log("SALVAR A CENA")
	var dados=new Object()
	dados.id = parseInt(req.body.id)
	dados.backgroundTexture=req.body.backgroundTexture
	dados.backgroundColor=req.body.backgroundColor
	dados.floorTexture=req.body.floorTexture
	dados.alien=req.body.alien
	var color=req.body.alien

	var query = { id: parseInt(req.body.id) };
	bd.collection('cena').deleteOne(query)
		.then((result)=>{
			//console.log("Deletou: "+result.deletedCount)
			if(result.deletedCount>0){
				bd.collection('cena').save(dados,(err,result)=>{
					if(err) return console.log(err)
					console.log("Alteraçoes salvas!")
				})
				if(color!="undefined" && color!=undefined){
					bd.collection('usuario').updateOne(query,{
						$set:{
							alien:color
						}
					},(err,result)=>{
						if(err) return res.send(err)
						console.log("Atualizou a cor do alien para "+color)
						var d = dados.id
						res.cookie("usuario",d)
						res.redirect('/login')
					})
				}else{
					var d = dados.id
					res.cookie("usuario",d)
					res.redirect('/login')
				}
			}else{
				console.log("DEU ERRO E NAO DEVIA")
			}
		}).catch(err=> console.log( res.send(500,err)))

})

//Erro
app.get('/erro/:msg', (req, res) => {
    res.render('erro.ejs',{data:req.params.msg})
})
