import pool from "./config";

exports.getSymbols = async () => {
    const client = await pool.connect();
    const result = await client.query({
        rowMode: "object",
        text: "SELECT * FROM symbols"
    });
    await client.end();
    return result.rows;
};

