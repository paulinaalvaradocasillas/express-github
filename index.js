const express = require('express');
const pool = require('./db'); 
const connectMongoDB = require('./mongoConnection'); 
const Vehiculo = require('./Vehiculo'); 

const app = express();
app.use(express.json());

connectMongoDB();


app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});


app.get('/alumnos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM alumno');
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener alumnos' });
    }
});

app.post('/alumnos', async (req, res) => {
    try {
        const { nombre, apellido, edad, correo } = req.body;
        const resultado = await pool.query(
            "INSERT INTO alumno (nombre, apellido, edad, correo) VALUES ($1, $2, $3, $4) RETURNING *",
            [nombre, apellido, edad, correo]
        );
        res.status(201).json({ mensaje: 'Alumno insertado', alumno: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar alumno' });
    }
});

app.get('/materias', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM materia');
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener materias' });
    }
});


app.get("/api/getVehiculos", async (req, res) => {
    try {
        const vehiculos = await Vehiculo.find();
        res.status(200).json({
            message: "Vehículos consultados correctamente",
            data: vehiculos
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al consultar vehículos",
            error: error.message
        });
    }
});

app.post("/api/createVehiculo", async (req, res) => {
    try {
        const { marca, modelo, anio, color } = req.body;

        if (!marca || !modelo || !anio || !color) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const nuevoVehiculo = new Vehiculo({ marca, modelo, anio, color });
        await nuevoVehiculo.save();

        res.status(201).json({
            message: "Vehículo creado correctamente",
            data: nuevoVehiculo
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al crear vehículo",
            error: error.message
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});