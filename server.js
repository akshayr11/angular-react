var express = require('express');
var cors = require('cors');
var compression = require('compression');
var path = require('path');


var app = express();
app.use(compression());
app.use(function (req, res, next) {
	// if (!req.secure) {
	// 	return res.redirect(['https://', req.get('Host'), req.url].join(''));
	// }
	next();
});

app.use(cors({
	origin: true,
	methods: 'POST, GET, PUT, DELETE, OPTIONS',
	exposedHeaders: 'Content-Range, X-Content-Range',
	credentials: true,
	allowedHeaders: 'Cache-Control, Origin, Authorization, Content-Type, X-Requested-With',
	// preflightContinue: false,
	// optionsSuccessStatus: 204,
	// maxAge: 1 * 60 * 60 * 1000
}));

const admin = express();
const manager = express();
const agent = express();
const DIST_FOLDER = path.join(process.cwd(), 'dist/apps');

admin.get('*', express.static(path.join(DIST_FOLDER, 'admin')));
admin.get('*', (req, res) => {
	res.sendFile(path.join(DIST_FOLDER, 'admin') + '/index.html');
});

agent.get('*', express.static(path.join(DIST_FOLDER, 'agent')));
agent.get('*', (req, res) => {
	res.sendFile(path.join(DIST_FOLDER, 'agent') + '/index.html');
});

manager.get('*', express.static(path.join(DIST_FOLDER, 'manager')));
manager.get('*', (req, res) => {
	res.sendFile(path.join(DIST_FOLDER, 'manager') + '/index.html');
});

app.use('/admin', admin);
app.use('/manager', manager);
app.use('/agent', agent);

app.use(express.static('dist/apps/main'));

app.get('*', function (req, res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.sendFile('/dist/apps/main/index.html', { root: __dirname });
})

app.listen(process.env.PORT || 4200, function () {
	console.log("HTTP server started listening on port: %s", process.env.PORT || 4200);
});
