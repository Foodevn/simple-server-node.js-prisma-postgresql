'use strict'

const express = require('express')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 9000

const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

// Middleware để parse JSON
app.use(express.json());

// Middleware CORS để cho phép client truy cập
app.use(cors({
    origin: '*', // Cho phép tất cả domain, có thể cấu hình cụ thể hơn
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get("/", (req, res) => {
    res.send('hello world');
});


// Middleware logging để hiển thị thông tin request
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip || req.connection.remoteAddress}`);

    // Log request body nếu có
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }

    next();
});

//Lấy danh sách
app.get('/api/todos', async (req, res) => {
    const todos = await prisma.todos.findMany();
    res.json(todos);
})

// Lấy todo theo id
app.get("/api/todos/:id", async (req, res) => {
    const todo = await prisma.todos.findUnique({
        where: {
            Id: parseInt(req.params.id),
        },
    });
    if (!todo) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(todo);
});

// Thêm todo mới
app.post('/api/todo', async (req, res) => {
    try {
        const { Title } = req.body;
        console.log('Creating new todo with title:', Title);

        const newTodo = await prisma.todos.create({
            data: {
                Title: Title || 'New Todo',
            },
        });
        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'Không thể tạo todo mới' });
    }
});

// Cập nhật todo
app.put('/api/todos/:id', async (req, res) => {
    try {
        const { Title } = req.body;
        const updatedTodo = await prisma.todos.update({
            where: {
                Id: parseInt(req.params.id),
            },
            data: {
                Title: Title || 'Updated Todo',
            },
        });
        res.json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Không tìm thấy todo để cập nhật' });
        } else {
            res.status(500).json({ error: 'Không thể cập nhật todo' });
        }
    }
});

// Xóa todo
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const deletedTodo = await prisma.todos.delete({
            where: {
                Id: parseInt(req.params.id),
            },
        });
        res.json(deletedTodo);
    } catch (error) {
        console.error('Error deleting todo:', error);
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Không tìm thấy todo để xóa' });
        } else {
            res.status(500).json({ error: 'Không thể xóa todo' });
        }
    }
});





// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Có lỗi xảy ra trên server',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Không tìm thấy endpoint này' });
});

// khoi dong web server
app.listen(port, () => {
    console.log(`server dang chay tren cong ${port}`);
    console.log(`API endpoints:`);
    console.log(`  GET    /api/todos     - Lấy danh sách todos`);
    console.log(`  GET    /api/todos/:id - Lấy todo theo id`);
    console.log(`  POST   /api/todo      - Tạo todo mới`);
    console.log(`  PUT    /api/todos/:id - Cập nhật todo`);
    console.log(`  DELETE /api/todos/:id - Xóa todo`);
});

