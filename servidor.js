const express = require('express');
const cors = require('cors');
const path = require('path'); // Nueva herramienta para leer archivos
const app = express();

// Render (la nube) nos dará un puerto automático. Si no, usamos el 3000
const puerto = process.env.PORT || 3000; 

app.use(express.json());
app.use(cors());

// 1. Le decimos al servidor que entregue tu expediente visual cuando entren a tu link
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'expediente.html'));
});

let baseDeDatosPacientes = [];

// 2. La ruta para guardar la información
app.post('/api/guardar-expediente', (req, res) => {
    const datosPaciente = req.body;
    baseDeDatosPacientes.push(datosPaciente);
    
    console.log("-------------------------------------------------");
    console.log("¡Éxito! Nuevo expediente clínico registrado en Sveltta.");
    console.log("Nombre del paciente:", datosPaciente.nombre);
    console.log("-------------------------------------------------");
    
    res.json({ 
        estatus: "éxito", 
        mensaje: "Expediente guardado correctamente en la base de datos de Sveltta." 
    });
});

app.listen(puerto, () => {
    console.log(`El servidor de Sveltta está activo en el puerto ${puerto}`);
});