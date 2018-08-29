import dotenv from 'dotenv';

const axios = require('axios');

dotenv.config();

const pg = require('pg');
const pool = new pg.Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
});
const { Pool } = require('client')
const pool = new Pool()

pool.connect((err, client, done) => {

    const shouldAbort = (err) => {
        if (err) {
            console.error('Error in transaction', err.stack)
            client.query('ROLLBACK', (err) => {
                if (err) {
                    console.error('Error rolling back client', err.stack)
                }
                // release the client back to the pool
                done()
            })
        }
        return !!err
    }

    client.query('BEGIN', (err) => {
        if (shouldAbort(err)) return
        client.query('INSERT INTO users(name) VALUES($1) RETURNING id', ['brianc'], (err, res) => {
            if (shouldAbort(err)) return

            const insertPhotoText = 'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)'
            const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo']
            client.query(insertPhotoText, insertPhotoValues, (err, res) => {
                if (shouldAbort(err)) return

                client.query('COMMIT', (err) => {
                    if (err) {
                        console.error('Error committing transaction', err.stack)
                    }
                    done()
                })
            })
        })
    })
})