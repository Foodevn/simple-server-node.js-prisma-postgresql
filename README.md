# Todo API Server

API server sử dụng Express.js và Prisma ORM với PostgreSQL database.

## Cài đặt Local

1. Clone repository
2. Cài đặt dependencies:
   ```bash
   npm install
   ```
3. Tạo file `.env` và thêm DATABASE_URL
4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
5. Push schema to database:
   ```bash
   npx prisma db push
   ```
6. Chạy server:
   ```bash
   npm run dev
   ```

## Deploy lên Vercel

### Chuẩn bị:
1. Đảm bảo bạn có tài khoản Vercel
2. Install Vercel CLI: `npm i -g vercel`

### Các bước deploy:

1. **Login vào Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy project:**
   ```bash
   vercel
   ```

3. **Cấu hình Environment Variables trên Vercel Dashboard:**
   - Vào Vercel Dashboard
   - Chọn project
   - Vào Settings > Environment Variables
   - Thêm `DATABASE_URL` với giá trị connection string PostgreSQL

4. **Redeploy sau khi thêm env vars:**
   ```bash
   vercel --prod
   ```

## API Endpoints

- `GET /` - Health check
- `GET /api/todos` - Lấy danh sách todos
- `GET /api/todos/:id` - Lấy todo theo ID
- `POST /api/todo` - Tạo todo mới
- `PUT /api/todos/:id` - Cập nhật todo
- `DELETE /api/todos/:id` - Xóa todo

## Body request cho POST/PUT:
```json
{
  "title": "Todo title"
}
```
