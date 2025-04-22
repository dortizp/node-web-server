import http from "node:http";
// const http = require("node:http");
import fs from "node:fs";

const requestListener = (req, response) => {
  console.log(req.url);

  if (req.url === "/" && req.method === "GET") {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Bienvenido a Notas");
  } else if (req.url === "/notes" && req.method === "GET") {
    response.writeHead(200, { "Content-Type": "application/json" });

    fs.readFile("notes.json", (error, content) => {
      if (error) {
        throw error;
      }

      const notes = JSON.parse(content);
      response.write(JSON.stringify(notes));
      response.end();
    });
  } else if (req.url.includes("notes") && req.method === "GET") {
    const id = parseInt(req.url.split("/")[2]);

    fs.readFile("notes.json", (error, content) => {
      if (error) {
        console.error(error);
      }

      const notes = JSON.parse(content);
      const note = notes.find((n) => n.id === id);

      if (!note) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end('{"error": "not found"}');
      } else {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(note));
      }
    });
  } else if (req.url === "/notes" && req.method === "POST") {
    // obtener el cuerpo de la solicitud : objeto JSON
    console.log("crear nueva nota");
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString(); // convierte el Buffer a string
    });

    req.on("end", () => {
      // aquí tienes el cuerpo completo de la solicitud POST
      body = JSON.parse(body);
      // const nuevoId = Math.random()*100;
      // agregar la nota al archivo notes.json
      fs.readFile("notes.json", (error, content) => {
        if (error) {
          console.error(error);
        }

        const notes = JSON.parse(content);

        const newId = notes.at(-1).id + 1;
        // const newId = (Math.random() * 100);
        const note = {
          id: newId,
          ...body,
        };
        console.log(note);

        notes.push(note);

        // escribir el archivo notes.json con notes que contiene la nueva nota
        fs.writeFile("notes.json", JSON.stringify(notes), (error) => {
          if (error) console.error(error);
        });
      });
      response.end();
    });
  } else if (req.url === "/archivo" && req.method === "GET") {
    fs.readFile("public/archivo.html", (error, content) => {
      if (error) {
        throw error;
      }

      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(content);
    });
  } else {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Solicitud no encontrada");
  }
};

const server = http.createServer(requestListener);
server.listen(5500);
