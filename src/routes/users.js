const express = require('express');
const routes = express.Router();
const ProfileController = require('../app/controllers/ProfileController');
const UserController = require('../app/controllers/UserController');
const SessionController = require('../app/controllers/SessionController');

const UserValidator = require('../app/validator/user');



//login/logout
//routes.get('/login', SessionController.loginForm);
//routes.post('/login', SessionController.login);
//routes.post('/logout', SessionController.logout);

//reset password / forgot
//routes.get('/forgot-password', SessionController.forgotForm);
//routes.get('/password-reset', SessionController.resetForm);
//routes.post('/forgot-password', SessionController.forgot);
//routes.post('/password-reset', SessionController.reset);

// Rotas de perfil de um usuário logado
routes.get('/register', ProfileController.registerForm);
routes.post('/register', UserValidator.post, ProfileController.post);
routes.put('/profile', UserValidator.update, ProfileController.put) //edit user
routes.get('/profile', UserValidator.show, ProfileController.index) //show form to logged in user

// Rotas que o administrador irá acessar para gerenciar usuários
//routes.get('/users', UserController.list) //Mostrar a lista de usuários cadastrados
//routes.post('/users', UserController.post) //Cadastrar um usuário
//routes.put('/users', UserController.put) // Editar um usuário
//routes.delete('/users', UserController.delete) // Deletar um usuário

module.exports = routes