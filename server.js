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
		var usuario = req.cookies.usuario.split("*")[1]
		console.log("Tem user: "+usuario)
		res.redirect("/mundo/"+usuario);
	}
    
})
app.get('/logout', (req, res) => { //logout
	res.cookie("usuario","")
    res.redirect('/login')
})

app.post('/login', (req, res) => { //fazer login
	var query = { usuario: req.body.usuario };
	bd.collection('usuario').find(query)
	.toArray((err, result) => {
       if (err) return console.log(err)
       console.log(result)
       if(result.length==0) {
       		res.redirect('/erro/Nao existe o usuario')
	       	return;
   		}
		if(result[0].senha==req.body.senha){
			console.log("Senha correta")
			var d= "*"+result[0].id+"*"+result[0].alien
			res.cookie("usuario",d)
			res.redirect("/mundo/"+result[0].id);
		}
		else{
			res.redirect('/erro/Senha Errada')
			console.log("Senha errada")
		}
	})
})
app.get('/mundo/:idb',(req,res)=>{
	let id= req.params.idb
	let query = { id: parseInt(id) };
	bd.collection('usuario').find(query)
		.toArray((err, result) => {
	       if (err) return console.log(err)
	       if(result.length==0) {
	       		res.redirect('/erro/Mundo nao Existe')
		       	//console.log("ERRO")
		        return;
	   		}
	   		alien=result[0].alien;
	   		res.cookie("alienMundo",alien)
			res.render('mundo.ejs')
	})
	
})

app.get('/cadastrar', (req, res) => { //pagina do cadastro
    res.render('cadastro.ejs')
})
app.post('/cadastrar', (req, res) => { //cadastrar
    bd.collection('usuario').find().toArray((err, results) => {
       if (err) return console.log(err)
       maior=0
       for (var i= results.length - 1; i >= 0; i--) {
      		if(results[i].id > maior)
      			maior=results[i].id  
       }
	    req.body.id = parseInt(maior) +1;
	    mundo={
	    	id:req.body.id,
	    	num_imagens:0,
	    	num_textos:0,
	    	num_videos:0,
	    	num_musicas:0,
	    	num_galerias:0,
	    	galerias:{},
	    	icon:null
	    }
	    console.log(mundo)
	    req.body.alien="blue"
	    console.log(req.body)
	    bd.collection('usuario').save(req.body,(err,result)=>{
			if(err) return console.log(err)
			bd.collection('mundo').save(mundo,(err,result)=>{
				if(err) return console.log(err)
				console.log("Salvo no mundo")
			})
			console.log("Salvo no BD")
			res.redirect('/login')
		})
    })
	
})

app.route('/teste').post((req,res)=>{
	var dados=new Object()
	dados.id = parseInt(req.body.id)
	dados.num_imagens=req.body.num_imagens
	dados.num_galerias=req.body.num_galerias
	dados.num_musicas=req.body.num_musicas
	dados.num_textos=req.body.num_textos
	dados.num_videos=req.body.num_videos
	
	dados.galerias=req.body.galerias
	dados.icon=req.body.icon
	//console.log(dados)
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
	//console.log(dados)
	var query = { id: parseInt(req.body.id) };
	console.log(query)
	console.log(dados.id)
	bd.collection('mundo').deleteOne(query)
		.then((result)=>{
			console.log("Deletou: "+result.deletedCount)
			if(result.deletedCount>0){
				bd.collection('mundo').save(dados,(err,result)=>{
					if(err) return console.log(err)
					console.log("Alteraçoes salvas!")
				})
			}else{
				console.log("Pq diacho nao ta apagando?")
			}
		}).catch(err=> console.log( res.send(500,err)))

})
//atualizar no bd
/*app.route('/edit/:idb')
.get((req,res)=>{
	var idd= req.params.idb
	console.log(idd)
	bd.collection('usuario').find({"_id":ObjectID(idd)}).toArray((err,result)=>{
		if(err) return res.send(err)
		res.render('edit.ejs',{data: result})
	})
})
.post((req,res)=>{
	var idb=req.params.idb
	var usuario = req.body.usuario
	var email=req.body.email
	var id=req.body.id
	var senha=req.body.senha
	bd.collection('usuario').updateOne({"_id":ObjectID(idb)},{
		$set:{
			usuario:usuario,
			id:id,
			email:email,
			senha:senha
		}
	},(err,result)=>{
		if(err) return res.send(err)
		res.redirect('/show')
		console.log("Atualizouu")
	})
})
*/
app.route('/delete/:idb')
.get((req,res)=>{
	var id=req.params.idb
	console.log(id)
	var query = { id: parseInt(id) };

	bd.collection('usuario').deleteOne(query)
		.then((result)=>{
			bd.collection('mundo').deleteOne(query)
			.then((result)=>{
				console.log("Deletanduu do mundo")
				console.log(result.deletedCount)
				res.redirect("/show");
			}).catch(err=> console.log( res.send(500,err)))
		})
		.catch(err=> console.log( res.send(500,err)))
	})
//Erro
app.get('/erro/:msg', (req, res) => {
    res.render('erro.ejs',{data:req.params.msg})
})
