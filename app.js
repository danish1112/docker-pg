import express from 'express';
import pkg from 'pg';

const Pool = pkg.Pool;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const app = express();

const PORT = 3004 || process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/healthcheck', (req, res) => {
    console.log("here...");
    res.status(200).json({message : "health is okay!!!"})
});

app.get('/create', async (req, res) => {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL
      )`);
      res.status(200).send("Table 'users' created (or already exists).");
    } catch (error) {
      console.error("Error creating table:", error);
      res.status(500).send("Error creating table.");
    }
});

app.post('/create', async (req, res) => {
    try {
        const {username, email} = req.body;

        await pool.query('Insert into users (username, email) values ($1, $2)', [username, email])
        res.status(200).send("inserted successfully!!!");
      res.status(200).send("Table 'users' created (or already exists).");
    } catch (error) {
      res.status(500).send("Error fetching data.");
    }
});

app.get('/users', async (req, res) => {
    try {
       const data = await pool.query('SELECT * FROM users')
        return res.status(200).json({mesage : data.rows});
    } catch (error) {
      res.status(500).send("Error fetching data.");
    }
});
  

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});