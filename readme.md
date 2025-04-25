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