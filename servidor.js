const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const puerto = process.env.PORT || 3000; 

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

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

// Ruta para el formulario de registro
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'expediente.html'));
});

// Ruta para la pantalla de consulta de expedientes
app.get('/consultar', (req, res) => {
    res.sendFile(path.join(__dirname, 'consultar.html'));
});

// Guardar expediente
app.post('/api/guardar-expediente', async (req, res) => {
    try {
        const datosPaciente = req.body;
        const database = client.db("SvelttaDB");
        const expedientes = database.collection("expedientes");
        
        // Agregamos fecha exacta de registro en el servidor
        datosPaciente.fecha_registro = new Date();
        
        await expedientes.insertOne(datosPaciente);
        
        res.json({ 
            estatus: "éxito", 
            mensaje: "¡Expediente guardado correctamente en la base de datos!" 
        });
    } catch (error) {
        console.error("Error al guardar:", error);
        res.status(500).json({ estatus: "error", mensaje: "No se pudo guardar en la base de datos." });
    }
});

// API para buscar expedientes por nombre
app.get('/api/buscar-expedientes', async (req, res) => {
    try {
        const query = req.query.q || '';
        const database = client.db("SvelttaDB");
        const expedientes = database.collection("expedientes");
        
        // Busca coincidencias por nombre (sin importar mayúsculas/minúsculas)
        const resultados = await expedientes.find({
            nombre: { $regex: query, $options: 'i' }
        }).sort({ _id: -1 }).limit(20).toArray();

        res.json(resultados);
    } catch (error) {
        console.error("Error al buscar:", error);
        res.status(500).json({ error: "Error al realizar la búsqueda" });
    }
});

app.listen(puerto, () => {
    console.log(`El servidor de Sveltta está activo en el puerto ${puerto}`);
});
