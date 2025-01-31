import mysql from 'mysql2/promise';
import express from "express";
import {config} from 'dotenv';
config()
 
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(port, ()=>{
    console.log(`localhost://${port}`)
});

const pool = mysql.createPool({
    hostname: process.env.HOSTNAME,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});
// 2a
app.get('/product', async (req, res) => {
    try {
        const [data] = await pool.query('SELECT * FROM product');
        res.json(data);
    } catch (error) {
        res.json({message: 'Server Error'})
    }
});
// 2b
app.get('/product/:product_code', async (req, res) => {
    try {
        const [data] = await pool.query('SELECT * FROM product WHERE product_code = ?', [req.params.product_code]);
        res.json(data);
    } catch (error) {
        res.json({message: 'Server Error'})
    }
});
// 2c
app.post('/product/add', async (req, res) => {
    try {
      const {product_code, product_name, product_price, product_quantity} = req.body;
      await pool.query(
        'INSERT INTO product (product_code, product_name, product_price, product_quantity) VALUES (?, ?, ?, ?)',
        [product_code, product_name, product_price, product_quantity]
      );
      res.json({message: 'Product added'});
    } catch (error) {
      res.json({message: 'Server Error'});
    }
  });

// 2d
app.delete('/product/:product_code', async (req, res) => {
    try {
        const [data] = await pool.query('DELETE FROM products WHERE product_code = ?', [req.params.product_code]);
        res.json(data);
    } catch (error) {
        res.json({message: 'Server Error'})
    }
})
// 2e
app.put('/product/:product_code', async (req, res) => {
    const {product_quantity} = req.body;
    try {
        const [data] = await pool.query('UPDATE product SET product_quantity = ? WHERE product_code = ?', [product_quantity,req.params.product_code]);
        res.json(data);
    } catch (error) {
        res.json({message: 'Server Error'})
    }
})

// 3f
app.get('/users', async (req, res) => {
    try {
        const [data] = await pool.query('SELECT * FROM users');
        res.json(data);
    } catch (error) {
        res.json({message: 'Server Error'})
    }
})

// 3g
app.get('/users/:id', async (req, res) => {
    try {
        const [data] = await pool.query('SELECT * FROM users WHERE ID = ?', [req.params.id]);
        res.json(data);
    } catch (error) {
        res.json({message: 'Server Error'})
    }
})

// 3h
app.post('/users/register', async (req, res) => {
    const {email,first_name,Last_name,password} = req.body;
    try {
        const [data] = await pool.query('INSERT INTO users (email,first_name,Last_name,password) VALUES (?,?,?,?)', [email,first_name,Last_name,password]);
        res.json(data);
    } catch (error) {
        res.json({message: 'Server Error'})
    }
})

app.delete('/user/:ID', async (req, res) => {
    try {
        const [data] = await pool.query('DELETE FROM users WHERE ID = ?', [req.params.ID]);
        res.json(data);
    } catch (error) {
        res.json({message: 'Server Error'})
    }
})
   

const getuser = async ()=>{
   const [data] = await pool.query('SELECT * FROM user');
   return data;
}
console.log(await getuser())

const getProduct= async()=>{
    const [data]=await pool.query('SELECT * FROM product');
    return data;
 }
console.log(await getProduct());

const deleteProduct = async (product_code)=>{
    const [data] = await pool.query('DELETE FROM product WHERE product_code = ?', [product_code]);
    return data;
}
console.log(await deleteProduct('baro1'));

const addProduct = async (product_name,product_code,product_price,product_quantity)=>{
    try {
        const [data] = await pool.query('INSERT INTO product (product_name,product_code,product_price,product_quantity) VALUES (?,?,?,?)', [product_name,product_code,product_price,product_quantity]);
        return data;
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error('Duplicate entry for product_code:', product_code);
        } else {
            console.error('Error adding product:', error);
        }
    }
}
console.log(await addProduct('Cadbury','cad1',16.50,5));

const updateProduct = async (product_code,product_quantity)=>{
    const [data] = await pool.query('UPDATE product SET product_quantity = ? WHERE product_code = ?', [product_code,product_quantity]);
    return data;
}
console.log(await updateProduct(9,'coke1'));

const insertQuery = 'INSERT IGNORE INTO product (product_name, product_code, product_price, product_quantity) VALUES (\'Cadbury\', \'cad1\', 16.5, 5)';

// // Assuming you're using async/await with your database connection
// async function addProduct() {
//     const productCode = 'cad1';
//     const [existingProduct] = await connection.query("SELECT * FROM product WHERE product_code = ?", [productCode]);

    // if (existingProduct.length > 0) {
    //     console.log(`Product with code ${productCode} already exists.`);
    // } else {
    //     // Insert the new product if it doesn't exist
    //     await connection.query("INSERT INTO product (product_name, product_code, product_price, product_quantity) VALUES (?, ?, ?, ?)", 
    //         ['Cadbury', 'cad1', 16.5, 5]);
    // }

