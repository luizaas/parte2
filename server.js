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
//app.use(session({secret: 'secret',saveUninitialized: true,resave: true}));

var ObjectID = require('mongodb').ObjectID;
var sess;//salva essa tralha nos temp do navegador
MongoClient.connect(uri,(err,client)=>{
	if(err) return console.log(err)
	bd=client.db("craft")
	app.listen(3000,function(){
		console.log("running in 3000")
	})
})

app.get('/', (req, res) => {
    //res.render('index.ejs')
    var usuario = bd.collection('usuario').find()
    res.redirect('/login')
    /*sess=req.session; //pegar do navegador?
    sess.id;
    sess.alien;*/
})

/*app.get('/', (req, res) => {
    var cursor = bd.collection('usuario').find()
    console.log(cursor)
})


app.get('/',(req,res)=>{
	var cursor =bd.collection('data').find()
	res.render('index.ejs')
})*/
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
	    req.body.mundo=""
	    req.body.alien="blue"
	    bd.collection('usuario').save(req.body,(err,result)=>{
			if(err) return console.log(err)
			console.log("Salvo no BD")
			res.redirect('/login')
		})
    })
	
})


/*app.post('/show',(req,res)=>{ //salva no bd
	bd.collection('usuario').find().toArray((err, results) => {
       if (err) return console.log(err)

       maior=0
       for (var i= results.length - 1; i >= 0; i--) {
      		if(results[i].id > maior)
      			maior=results[i].id  
       }
	    console.log(maior)
	    req.body.id =  parseInt(maior) +1;
	    console.log(req.body.id)
	    bd.collection('usuario').save(req.body,(err,result)=>{
		if(err) return console.log(err)
		console.log("Salvo no BD")
		res.redirect('/show')
		})
    })
	
})*/

//atualizar no bd
app.route('/edit/:idb')
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

app.route('/delete/:idb')
.get((req,res)=>{
	var id=req.params.idb
	console.log(id)
	var query = { id: parseInt(id) };

	bd.collection('usuario').deleteOne(query)
		.then((result)=>{
			console.log("Deletanduu")
			console.log(result.deletedCount)
			res.redirect("/show");
		})
		.catch(err=> console.log( res.send(500,err)))
	})

app.get('/erro/:msg', (req, res) => { //pagina do cadastro
    res.render('erro.ejs',{data:req.params.msg})
})
