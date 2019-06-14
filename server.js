const express =require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient = require('mongodb').MongoClient 
const uri = "mongodb+srv://user1:senha@cluster0-jfusq.gcp.mongodb.net/test?retryWrites=true&w=majority"
app.set('view engine','ejs')
app.use('/static', express.static('static')) //NAO TOQUE
app.use(bodyParser.urlencoded({extended:true}))
var ids=1;
MongoClient.connect(uri,(err,client)=>{
	if(err) return console.log(err)
	bd=client.db("craft")
	app.listen(3000,function(){
		console.log("running in 3000")
	})
})

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/', (req, res) => {
    var cursor = db.collection('usuario').find()
})


/*app.get('/',(req,res)=>{
	var cursor =bd.collection('data').find()
	res.render('index.ejs')
})*/
app.get('/show', (req, res) => { //cata do bd
    bd.collection('usuario').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results })

    })
})

app.post('/show',(req,res)=>{ //salva no bd
	ids++
	req.body.id=ids
	bd.collection('usuario').save(req.body,(err,result)=>{
		if(err) return console.log(err)
		console.log("Salvo no BD")
		res.redirect('/show')
	})
	

	console.log(req.body)
})

app.route('/edit/:idb')
.get((req,res)=>{
	var idd= req.params.id
	bd.collection('usuario').find(ObjectID(idb)).toArray((err,result)=>{
		if(err) return res.send(err)
		res.render(edit.ejs,{data:result})
	})
})
.post((req,res)=>{
	var idb=req.params.idb
	var usuario = req.params.usuario
	var email=req.params.email
	var id=req.params.id
	bd.collection('usuario').updateOne({_id:ObjectID(id)},{
		$set:{
			usuario:usuario,
			id:id,
			email:email,
		}
	},(err,result)=>{
		if(err) return res.send(err)
		res.redirect('/show')
		console.log("Atualizouu")
	}
	)
})