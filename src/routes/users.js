const express = require('express');
const routes = express.Router();
const ProfileController = require('../app/controllers/ProfileController');
const UserController = require('../app/controllers/UserController');
const SessionController = require('../app/controllers/SessionController');

const ProfileValidator = require('../app/validator/profile');
const UserValidator = require('../app/validator/user');
const SessionValidator = require('../app/validator/session');
const {onlyUser} = require('../app/middlewares/session');

//login/logout
routes.get('/login', SessionController.loginForm);
routes.post('/login', SessionValidator.login, SessionController.login);
routes.post('/logout', SessionController.logout);

//reset password / forgot
routes.get('/forgot-password', SessionController.forgotForm);
routes.get('/password-reset', SessionController.resetForm);
routes.post('/forgot-password', SessionValidator.forgot,    SessionController.forgot);
routes.post('/password-reset', SessionValidator.reset, SessionController.reset);

//Admin profile
routes.get('/register', ProfileController.registerForm);
routes.post('/register', UserValidator.post, ProfileController.post);
routes.get('/profile', onlyUser, UserValidator.show, ProfileController.index);
routes.put('/profile', onlyUser, UserValidator.update, ProfileController.put);

//Users profile
routes.get('/users', UserController.list);
routes.get('/users/create', UserController.create);
routes.post('/users', ProfileValidator.post, UserController.post);
routes.get('/users/:id', UserController.show);
routes.put('/users', UserController.put) // Editar um usuário
routes.get('/users/:id/delete', UserController.deletePage);
routes.delete('/users', UserController.delete) // Deletar um usuário

module.exports = routes