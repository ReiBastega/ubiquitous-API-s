
@bruno:

cria um .env com essas variaveis abaixo na raiz do projeto, depois é so rodar docker compose up -d

sobe as migrations antes de fazer os testes, pra fica mais facil sobe a migration que tem no node_api -> entao, entra na api em node e roda npm run drizzle:push DEPOIS DE TER FEITO P PASSO ACIMA pq tenq ter o posgres rodando

API_INSTANCE_1_PORT=3000
API_INSTANCE_2_PORT=3001
API_INSTANCE_3_PORT=3002
DB_HOST=db
DB_USER=postgres
DB_PASSWORD=123456789
DB_PORT=5432
DB_NAME=ubqtdatabase



pra para o postgre vai na raiz do projeto e da um docker compose down


