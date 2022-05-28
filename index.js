//Include the http and file server modules from node
const http = require("http");
const fs = require("fs");

//set html files as files from /pages folder
const htmlfiles = fs
	.readdirSync("./pages", { withFileTypes: true })
	.map((file) => file.name);

//set css file as files from /styles folder
const cssfiles = fs
	.readdirSync("./styles/", { withFileTypes: true })
	.map((file) => file.name);

// set homepage and page404 variables
// set 404.html file as page404 variable
let homepage = "/";
let page404;
fs.readFile("./pages/404.html", (err, data) => {
	page404 = data;
});

// this section creates the server and takes you to the index page
// createserver method creates a new http server and runs it
// when new request is received, request event is called providing two objects:
// a request (an http.IncomingMessage object) and a response (an http.ServerResponse object).
// The first provides the request details, The second is used to return data to the caller. In this case with: res.statusCode = 200;
// request provides the request details
const server = http.createServer((req, res) => {
	// if filename is homepage, set as index, if not, set as filename(1)
	let filename = req.url;
	let requested_dir;
	filename = filename === homepage ? "index" : filename.substr(1);

	// this section prints current task to the console
	// if loading an html file, print the file.html and location to console
	if (htmlfiles.includes(filename + ".html")) {
		console.log(`\n`, "--loading page--", `\n`);
		filename += ".html";
		requested_dir = "./pages/";
		// else if loading an css file, print the file.css and location to console
	} else if (cssfiles.includes(filename)) {
		console.log(`\n`, "--loading style--", `\n`);
		requested_dir = "./styles/";
	}

	// This section fetches the data from the server while printing the task to the console.
	// Response is used to populate the data we're going to return to the client.
	// print directory and file name being requested
	console.log(`requesting==> ${requested_dir}${filename}`, " ---");
	fs.readFile(requested_dir + filename, (err, data) => {
		// if error, print not found to console and display page 404
		if (err) {
			console.log(`--${filename} not found--`);
			res.writeHead(404, { "Content-Type": "text/html" });
			res.write(page404);
			res.end();
		} else {
			// else, print take to pages where index.html will display
			if (requested_dir == "./pages/") {
				res.writeHead(200, { "Content-Type": "text/html" });
				res.write(data);
				res.end();
				// also print css file being pulled to console as well
			} else if (requested_dir == "./styles/") {
				res.writeHead(200, { "Content-Type": "text/css" });
				res.write(data);
				res.end();
			}
		}
	});
});

// this section runs the server when someone triess to access port 3000
// when the server is ready, the callback function is called, in this case informing us that the server is running.
// prints hostname and port to the console
server.listen(3000, () => {
	console.log("Server started --- listening on port 3000");
});
