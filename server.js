var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

var PORT = 3000;

// let messages = [
// 	{name: 'Leo', message: 'Hi !!'},
// 	{name: 'Crater', message: 'Hello'},
// ];

var Messages = mongoose.model('messages', {
	name: String,
	message: String,
});

var dbUrl = "mongodb+srv://bhs:bhs@cluster0-feibl.mongodb.net/test?retryWrites=true&w=majority"
const mongooseOptions = { useUnifiedTopology: true, useNewUrlParser: true };

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/messages', (req, res) => {
	Messages.find({}, (err, messages) => {
		res.send(messages);
	})
});

app.post('/messages', (req, res) => {
	let messages = new Messages(req.body);
	messages.save((err) => {
		if(err) {
			req.sendStatus(500);
		} else {
			io.emit('newMessage', req.body);
			res.sendStatus(200);
		}
	});
	
});

io.on('connection', () => {
	console.log('a user connected');
});


mongoose.connect(dbUrl, mongooseOptions, (err) => {
	console.log('DB connection with mongoose', err)
})

var server = http.listen(PORT, ()=> {
	console.log(`Listening at PORT ${PORT}`, server.address().port)
});