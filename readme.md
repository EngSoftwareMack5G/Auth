# Váriaveis de ambiente .env
Para se alguem precisar.
```
PORT=3002
DB_USER=postgres
DB_PASSWORD=123456
DB_HOST=localhost
DB_PORT=5432
DB_NAME=authdb
SECRET=segredo_super_top
```

Criar a tabela
```sql
CREATE TABLE users (
  username VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  type VARCHAR(255)
);
```

Endpoints até o momento:

## POST auth/register
Necessita do body:
```json
{
    "username": "emailvalido@gmail.com",
    "password": "senhainsana",
    "type": "mentores"
}
```
Cria uma nova entrada no banco

## POST auth/login
Necessita do body:
```json
{
    "username": "emailvalido@gmail.com",
    "password": "senhainsana"
}
```
Retorna um Jsonwebtoken se usuário e senha estiverem corretos.

**Exemplo token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RlNkBnbWFpbC5jb20iLCJ0eXBlIjoiTWVudG9yZXMiLCJpYXQiOjE3NDU2MTk5MDYsImV4cCI6MTc0NTYyMzUwNn0.GV_K0y0U6zazJO9y_5p4ihfsP0CC8iKUtTU3DDCLyec
```

## GET auth/key
Necessita do header: **authorization: bearer \<token\>**
Não sei se será necessário esse endpoint, existe mais para testes

Retorna um json:
```json
{
    "username": "emailvalido@gmail.com",
    "type": "mentores",
    "expiresIn": 123123133
}
```

## DELETE auth/delete
Necessita do header: **authorization: bearer \<token\>**
Retorna uma json com uma mensagem e o termo isDeleted
```json
{
    "message": "Usuário deletado com sucesso",
    "isDeleted": true
}
```
