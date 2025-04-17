// import http from "node:http";
const http = require("node:http");

const requestListener = (req, response) => {
  console.log(req.url);

  if (req.url === "/" && req.method === "GET") {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Bienvenido a Notas");
  } else if (req.url === "/notes") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(notes));
    response.end();
  } else if (req.url.includes("notes")) {
    const id = parseInt(req.url.split("/")[2]);
    const note = notes.find((n) => n.id === id);
    if (!note) {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end('{"error": "not found"}');
    } else {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(note));
    }
  } else {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Solicitud no encontrada");
  }
};

const server = http.createServer(requestListener);
server.listen(5500);

const notes = [
  { id: 1, content: "Hacer la cama" },
  { id: 2, content: "Lavar los platos" },
  { id: 3, content: "Estudiar JavaScript" },
  { id: 4, content: "Hacer las compras" },
  { id: 5, content: "Limpiar mi habitación" },
  { id: 6, content: "Almorzar a tiempo" },
];
