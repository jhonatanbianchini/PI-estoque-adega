const pool = require("../config/db");

exports.createProduct = async (req, res) => {

  try {

    const { produto, quantidade, validade } = req.body;

    const result = await pool.query(
      "INSERT INTO products (produto, quantidade, validade) VALUES ($1, $2, $3) RETURNING *",
      [produto, quantidade, validade]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json(error);
  }

};

exports.getProducts = async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM products ORDER BY id ASC"
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json(error);
  }

};

exports.updateProduct = async (req, res) => {

  try {

    const { id } = req.params;
    const { produto, quantidade, validade } = req.body;

    const result = await pool.query(
      `
      UPDATE products
      SET produto = $1,
          quantidade = $2,
          validade = $3
      WHERE id = $4
      RETURNING *
      `,
      [produto, quantidade, validade, id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json(error);
  }

};

exports.deleteProduct = async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM products WHERE id = $1",
      [id]
    );

    res.json({
      message: "Produto removido"
    });

  } catch (error) {
    res.status(500).json(error);
  }

};