/**
 * Initialisation de Express
 */

let express = require('express')
let app = express()


/**
 * Modules de Securité d'une API (logs, XSS securité etc...)
 */
let cors = require('cors'); // pour l'accès à l'API
let bodyParser = require('body-parser'); // pour la sécurité
let logger = require('morgan'); // permet d'utiliser les logs pour tracer dans la console
let helmet = require('helmet'); // pour la sécurité des sessions

let bcrypt = require('bcrypt'); // module pour crypter le mot de passe
let nodemailer = require('nodemailer'); // module pour envoi d'email

app.use(logger('dev'));
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({ secret: 'hK34B23B4HJ', resave: false, saveUninitialized: false }));
app.use(bodyParser.json());
app.use(cors());
logger('tiny')
app.use(helmet());

/**
 * Nodemailer configuration
 */
var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "73d84a50604070",
        pass: "af019e5b99b7b1"
    }
});


/**
 * Module RethinkDb
 */
let r = require('rethinkdb');



/**
 * Erreur 500 sortie en JSON
 */
app.use(function (error, request, response, next) {
    response.status(error.status || 500);
    response.json({ error: error.message });
});



// connexion à la bdd
let connection = r.connect({
    db: "test" //your database
}).then((connection) => { // une fois qu'il a effectué une connexion


    app.get('/', (req, res) => {
			// run() sert à executer la requete
			r.table('faq').orderBy('question').run(connection, (err, cursor) => {
				if(err) throw err;

				cursor.toArray((err, result) => {
					res.json(result);
				})

			})

    });

		// app.post('/newFaq', (req, res) => {

		// 	// req.params => paramètres en GET (URL)
		// 	// req.body =< récupérer un paramètre en POST
		// 	let item = req.body;

		// 	// run() sert à executer la requete
		// 	r.table('faq').insert(item).run(connection, (err, cursor) => {
		// 		if(err) throw err;

		// 		r.table('faq').pluck('id', 'question', 'reponse').orderBy('question').run(connection, (err, cursor) => {

		// 			cursor.toArray((err, result) => {
		// 				res.json(result);
		// 			})

		// 		});

		// 	});
		
		// });

		app.post('/newFaq', (req, res) => {

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(req.body.reponse, salt, function (err, hash) {

                let now = new Date();
                r.table('faq').insert({
                    question: req.body.question,
                    reponse: hash,
                    created: now
                }).run(connection, (err, result) => {

                    // setup email data with unicode symbols
                    let mailOptions = {
                        from: '"Renaud Denier" <renaud@renaudmail.com>', // sender address
                        to: '"Renaud Denier" <gentilcontributeur@mail.com>', // list of receivers
                        subject: 'Bravo, vous avez ajouté une nouvelle faq ✔', // Subject line
                        text: 'Awesome long paragraph about your contribution...', // plain text body
                        html: `<h1>Hello!</h1>
                        <p>Awesome long paragraph about your contribution...</p>
                        <p> Ajouté le ${now}</p>`
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);

						r.table('faq').orderBy('question').run(connection, (err, cursor) => {
							if(err) throw err;

							cursor.toArray((err, result) => {
								res.json(result);
							})

						})

                  	});


                })
            });
        });

    });

		app.get('/remove/:id', (req, res) => {

			// récupérer l'ID en GET (URL)
			let id = req.params.id;

			// run() sert à executer la requete
			r.table('faq').get(id).delete().run(connection, (err, cursor) => {
				if(err) throw err;

				r.table('faq').pluck('id', 'question', 'reponse').orderBy('question').run(connection, (err, cursor) => {

					cursor.toArray((err, result) => {
						res.json(result);
					})

				})
			})

    });





		app.get('/detail/:id', (req, res) => {

			// récupérer l'ID en GET (URL)
			let id = req.params.id;

			// run() sert à executer la requete
			r.table('users').get(id).run(connection, (err, result) => {
						res.json(result);
			})
    });


		app.get('/', (req, res) => {
			// run() sert à executer la requete
			r.table('users').pluck('id', 'name', 'email').run(connection, (err, cursor) => {
				if(err) throw err;

				cursor.toArray((err, result) => {
					res.json(result);
				})

			})

    });



});

app.listen(3000, function () {
    console.log('Listened on port 3000!')
})