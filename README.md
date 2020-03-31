<h1 align="center">
    <img alt="Foodfy" src="https://github.com/helcioItiyama/Foodfy-Final-Project/blob/master/public/images/logo2.png" width="400px" />
</h1>

## :arrow_right: ABOUT THE PROJECT

This project was developed for the final challenge of the Rocketseat Launchstore course. It is a website where users who register and become administrator can create, change and delete recipes, as well as assign them to a specific chef. They can also create, change and delete profiles of such chefs. In addition, they can invite new users, who can be administrators or not.

Users who are not administrators will only have access to the list and profiles of chefs, list and details of recipes. They will also be able to create, change and delete only the recipes created by himself.

![recipes list](https://github.com/helcioItiyama/Foodfy-Final-Project/blob/master/public/images/Receitas.png)

Therefore, access control for users and administrators is done through a login system.

Users without registration can only view the list and details of recipes and chefs. However, if he wanted to create a recipe, he will be redirected to the login page.

There are two buttons on the login page:

**'Register'**: users will be redirected to a page to fill out a form and create a password for registration;

**'Forgot password?'**: users will be redirected to a page where they can enter an email, where it will be sent the token to create a new password.

![login page](https://github.com/helcioItiyama/Foodfy-Final-Project/blob/master/public/images/Login.png)

Users who are administrators can invite friends to use the site. For inviting, they only need to enter the guest's name and email. The guest will receive an invitation via email with a temporary password to access the system.

Only administrators can change or delete other users, including whether or not they can be administrators as well. Administrators can change their profiles, but to delete their account, they must send an email to the website company.

Another restriction is that only chefs without assigned recipes can be deleted.

![delete restriction](https://github.com/helcioItiyama/Foodfy-Final-Project/blob/master/public/images/2020-03-30-20-39-35.gif)

The website was developed using responsive design to be accessible on all types of devices.

![responsive site](https://github.com/helcioItiyama/Foodfy-Final-Project/blob/master/public/images/2020-03-30-15-58-35.gif)

## :computer: FOR THIS PROJECT IT WAS USED THE FOLLOGING TECNOLOGIES:

- [**express**](https://github.com/expressjs/express)
- [**nunjunks**](https://github.com/mozilla/nunjucks)
- [**postgres**](https://www.postgresql.org/)
- [**express-session**](https://github.com/expressjs/session)
- [**nodemailer**](https://github.com/nodemailer/nodemailer)
- [**multer**](https://github.com/expressjs/multer)
- [**crypto-js**](https://github.com/brix/crypto-js)
- [**bcryptjs**](https://github.com/kelektiv/node.bcrypt.js)
- [**lottie**](https://github.com/airbnb/lottie-web)

## :information_source: HOW TO RUN THE APPLICATION
To clone and run this application, you'll need Git, NodeJS and Yarn.

You just need to run the following commands:

```bash
# Clone this repository
$ git clone https://github.com/helcioItiyama/Foodfy-Final-Project.git

# Go into the repository
$ cd Foodfy-Final-Project

# Install dependencies
$ npm install

# Run the app
$ npm start
```





























<h3 align="center">
  Desafio 7: Envio de imagens Foodfy
</h3>

<blockquote align="center">“Quanto mais você estuda, mais aprende e se aproxima de realizar seu sonhos!”</blockquote>

<p align="center">

  <a href="https://rocketseat.com.br">
    <img alt="Made by Rocketseat" src="https://img.shields.io/badge/made%20by-Rocketseat-%23F8952D">
  </a>

  <a href="LICENSE" >
    <img alt="License" src="https://img.shields.io/badge/license-MIT-%23F8952D">
  </a>

![responsivel](/images/Responsive.jpg)
</p>

<p align="center">
  <a href="#rocket-sobre-o-desafio">Sobre o desafio</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#calendar-entrega">Entrega</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-licença">Licença</a>
</p>

## :rocket: Sobre o desafio

Você irá criar um sistema de envio de imagem, conforme as especificações abaixo.

Veja também as especificações do layout, abrindo o arquivo que está em [layouts/index.html](../layouts/index.html) no seu navegador Google Chrome. 

**Download dos arquivos:** https://github.com/Rocketseat/bootcamp-launchbase-desafios-07/archive/master.zip

### Tabelas

Crie uma tabela de nome `files` com os campos

- `id SERIAL PRIMARY KEY`
- `name TEXT`
- `path TEXT NOT NULL`

Essa tabela acima irá receber todas as imagens do sistema.

Crie uma tabela de nome `recipe_files` com os campos

- `id SERIAL PRIMARY KEY`
- `recipe_id INTEGER REFERENCES recipes(id)`
- `file_id INTEGER REFERENCES files(id)`

Você vai precisar buscar as imagens de uma receita, criando um 
relacionamento entre as tabelas `recipe_files` com a tabela `files`

### Receitas

Adicionar imagens às receitas.

- No banco de dados, remova o campo `image`, pois não será mais necessário.
- Crie um campo de upload de imagens
- Coloque um limite de 5 imagens
- A receita deve ter pelo menos uma imagem

**Criação de uma receita**
![Imagem da Página de Criação de Receitas](../layouts/preview/desafio-07-receita-criação.png)

**Edição de uma receitas**
![Imagem Página de Edição de Receitas](../layouts/preview/desafio-07-receita-edição.png)

### Chefs

Adicionar a imagem de avatar para o chef

- Remova o campo `avatar_url` da tabela de chefs
- Adicione o campo `file_id INTEGER REFERENCES files(id)`

Você vai precisar criar um relacionamento entre `chefs` e `files`

Dica: Use `ALTER TABLE` para fazer as alterações da tabela de chefs.

**Criação de um chef**
![Imagem da Página de Criação de Chef](../layouts/preview/desafio-07-chef-criação.png)

**Edição de um chef**
![Imagem Página de Edição de Chef](../layouts/preview/desafio-07-chef-edição.png)

### Apresentação

Mostrar as novas imagens de receitas e chefs que estarão cadastradas no banco de dados.

Na página de detalhe de uma receita, criar uma funcionalidade de troca de imagens conforme imagem abaixo.
![Imagem da Página de Detalhes de uma Receita](../layouts/preview/desafio-07-receita-detalhe.png)

**Não haverá alterações** visuais para os chefs.

### Novos conceitos

Aplique os conceitos de `async/await` e de `try/catch` que você aprendeu nas aulas.

## :calendar: Entrega

Esse desafio **não precisa ser entregue** e não receberá correção. Após concluí-lo, adicionar esse código ao seu Github é uma boa forma de demonstrar seus conhecimentos para oportunidades futuras.

## :memo: Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.

---

Feito com :purple_heart: by [Rocketseat](https://rocketseat.com.br) :wave: [Entre na nossa comunidade!](https://discordapp.com/invite/gCRAFhc)
