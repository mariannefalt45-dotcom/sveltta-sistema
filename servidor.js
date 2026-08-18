const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const puerto = process.env.PORT || 3000; 

// Aumentamos el límite de tamaño para que acepte la firma sin reiniciarse
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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'expediente.html'));
});

app.post('/api/guardar-expediente', async (req, res) => {
    try {
        const datosPaciente = req.body;
        
        const database = client.db("SvelttaDB");
        const expedientes = database.collection("expedientes");
        
        const resultado = await expedientes.insertOne(datosPaciente);
        
        console.log("-------------------------------------------------");
        console.log("¡Éxito! Expediente guardado permanentemente en MongoDB.");
        console.log("Paciente:", datosPaciente.nombre);
        console.log("-------------------------------------------------");
        
        res.json({ 
            estatus: "éxito", 
            mensaje: "¡Expediente guardado correctamente en la base de datos!" 
        });
    } catch (error) {
        console.error("Error al guardar:", error);
        res.status(500).json({ estatus: "error", mensaje: "No se pudo guardar en la base de datos." });
    }
});

app.listen(puerto, () => {
    console.log(`El servidor de Sveltta está activo en el puerto ${puerto}`);
});
