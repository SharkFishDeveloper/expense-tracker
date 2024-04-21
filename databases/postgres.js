const { Pool } = require('pg')
const express = require('express')
const e = require('express')
const router = express.Router()

// Create a new pool for handling database connections
// using variables
// const pool = new Pool({
// 	user: 'your-user',
// 	host: 'localhost',
// 	database: 'your-database',
// 	password: 'your-password',
// 	port: 5432,
// })

// or using connection string

	const pool = new Pool({
		connectionString: "postgresql://shahzebakhtar66:z7v6bFPRiafu@ep-morning-violet-a5txgtbx.us-east-2.aws.neon.tech/prisma_migrate_shadow_db_13c76688-1fee-4e73-8528-e144b56639fd?sslmode=require"
	})


// Define route to get all expenses
router.get('/expenses', async (req, res) => {
	// return res.json({message:"plawo"})
	try {
		const query = 'SELECT * FROM expenses'
		const { rows } = await pool.query(query)
		res.json(rows)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Define route to add a new expense
router.post('/expenses', async (req, res) => {
	try {
		const { name, amount, date } = req.body
		const query =
			'INSERT INTO expenses (name, amount, date) VALUES ($1, $2, $3) RETURNING *'
		const { rows } = await pool.query(query, [name, amount, date])

		res.status(201).json(rows[0])
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Define route to remove an expense
router.delete('/expenses/:id', async (req, res) => {
	try {
		const id = req.params.id
		const query = 'DELETE FROM expenses WHERE id = $1'
		await pool.query(query, [id])
		res.sendStatus(200)
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Internal server error' })
	}
})

// Define route to update an expense
router.put('/expenses/:id', async (req, res) => {
	try {
		const id = req.params.id
		const { name, amount, date } = req.body
		const query =
			'UPDATE expenses SET name = $1, amount = $2, date = $3 WHERE id = $4 RETURNING *'
		const { rows } = await pool.query(query, [name, amount, date, id])
		res.status(201).json(rows[0])
	} catch (err) {
		console.error(err)
		res.status(500).json({ error: 'Internal server error' })
	}
})



module.exports = router



const createExpensesTable = async () => {
    try {
        // Define the SQL query to create the expenses table
        const query = `
            CREATE TABLE IF NOT EXISTS expenses (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                amount DECIMAL NOT NULL,
                date DATE NOT NULL
            )
        `;
        
        // Execute the query
        await pool.query(query);
        console.log('Expenses table created successfully');
    } catch (error) {
        console.error('Error creating expenses table:', error);
    } finally {
        // Close the database connection pool
        await pool.end();
    }
};

// createExpensesTable();