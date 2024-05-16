const express = require('express'); 
const app = express();
const Pool = require('pg').Pool;
const PORT = 3000;
require('dotenv').config();

const pool = new Pool({
    user: process.env.USER_NAME,
    host: process.env.HOST_NAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT
});

app.use(express.json());
app.listen(PORT, () => {    
    console.log(`Server is running on port ${PORT}.`);
});

app.use(express.json())//converts the incoming data to JSON format

//routes

//get all students

app.get('/students', (req, res) => {

    try {
        pool.query(`SELECT * FROM "Students" ORDER BY id ASC`, (err, result) => {
            if (err) {
                throw err;
            }
            res.json(result.rows);
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

//get a student

app.get('/getStudentByName/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const student = await pool.query(`SELECT * FROM "Students" WHERE name = $1`, [name]);
        res.json(student.rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//add a student

app.post('/addStudent', async (req, res) => {
    try {
        const { name } = req.body;
        console.log("body", req.body);
        const newStudent = await pool.query(`INSERT INTO "Students" (id, name) VALUES ((SELECT max(Id)+1 FROM "Students"), $1) RETURNING *`, [name]);
        // res.json(newStudent.rows[0]);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//update a student

app.put('/updateStudentName/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const { updatedName } = req.body;
        console.log("updatedName", updatedName, "name", name);
        const student = await pool.query(`UPDATE "Students" SET name = $1 WHERE name = $2`, [updatedName, name]);
        res.json('Student name updated successfully');
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//delete a student

app.delete('/deleteStudent/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const student = await pool.query(`DELETE FROM "Students" WHERE name = $1`, [name]);
        res.json('Student deleted successfully');
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




