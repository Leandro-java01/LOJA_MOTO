# LOJA_MOTO

Para fazer o upload dos arquivos e necessario seguir os passos abaixo
git add . 
git checkout 
git commit -m "primeiro commit"
git push

Para que a aplicacao funcione corretamente e necessario executar o 
npm install 
e os modulos abaixo
npm install --save morgan
npm install --save -g express-generator
npm install --save mysql
npm install --save formidable 
npm install --save cookie-parser 
npm install --save ejs 

Preparando o banco
como foi feito o migration: https://www.youtube.com/watch?v=pv9LwNretEA
docker container stop fd4f2ee753bf
docker rm f5d521cb2266
docker run -p 127.0.0.1:3306:3306  --name my-mariadb -e MYSQL_ROOT_PASSWORD=root -d mariadb
create database loja;
sudo adonis migration:run

para dar inicio no projeto, basta executar

npm start