const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb'); // Herramienta para conectar a MongoDB

const app = express();
const puerto = process.env.PORT || 3000; 

app.use(express.json());
app.use(cors());

// PEGA AQUÍ TU LLAVE SECRETA ENTRE LAS COMILLAS:
const uri = "mongodb+srv://mariannefalt45_db_user:cF8ldzznf215zMXF@cluster0.5ell803.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

async function conectarDB() {
    try {
        await client.connect();
        console.log("¡Conectado exitosamente a la base de datos real de Sveltta!");
    } catch (e) {
        console.error("Error al conectar a MongoDB:", e);
    }
}
conectarDB();

// Entregar la página web visual
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'expediente.html'));
});

// Ruta para guardar el expediente DIRECTO A LA BASE DE DATOS
app.post('/api/guardar-expediente', async (req, res) => {
    try {
        const datosPaciente = req.body;
        
        // Seleccionamos nuestra base de datos y la colección de expedientes
        const database = client.db("SvelttaDB");
        const expedientes = database.collection("expedientes");
        
        // Guardamos el documento de forma permanente
        const resultado = await expedientes.insertOne(datosPaciente);
        
        console.log("-------------------------------------------------");
        console.log("¡Éxito! Expediente guardado permanentemente en MongoDB.");
        console.log("Paciente:", datosPaciente.nombre);
        console.log("-------------------------------------------------");
        
        res.json({ 
            estatus: "éxito", 
            mensaje: "Expediente guardado permanentemente en la base de datos." 
        });
    } catch (error) {
        console.error("Error al guardar:", error);
        res.status(500).json({ estatus: "error", mensaje: "No se pudo guardar en la base de datos." });
    }
});

app.listen(puerto, () => {
    console.log(`El servidor de Sveltta está activo en el puerto ${puerto}`);
});