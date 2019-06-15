const express =require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient = require('mongodb').MongoClient 
const uri = "mongodb+srv://user1:senha@cluster0-jfusq.gcp.mongodb.net/test?retryWrites=true&w=majority"
const mongoose = require('mongoose');


app.set('view engine','ejs')
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
    res.render('index.ejs')
    var usuario = bd.collection('usuario').find()
})

app.get('/', (req, res) => {
    var cursor = bd.collection('usuario').find()
    console.log(cursor)
})


/*app.get('/',(req,res)=>{
	var cursor =bd.collection('data').find()
	res.render('index.ejs')
})*/
app.get('/show', (req, res) => { //cata do bd
    bd.collection('usuario').find().toArray((err, results) => {

        if (err) return console.log(err)
        console.log(results)
        res.render('show.ejs', { data: results })
    })
})

app.get('/login', (req, res) => { //cata do bd
    res.render('index.ejs')
})
app.post('/login', (req, res) => { //cata do bd
    console.log("Faz login")
})
app.get('/cadastrar', (req, res) => { //cata do bd
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
	    console.log(maior)
	    req.body.id =  parseInt(maior) +1;
	    console.log(req.body.id)
	    bd.collection('usuario').save(req.body,(err,result)=>{
		if(err) return console.log(err)
		console.log("Salvo no BD")
		res.redirect('/login')
		})
    })
	
})


app.post('/show',(req,res)=>{ //salva no bd
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
	
})

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



