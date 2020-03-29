const express = require('express');
const routes = express.Router();
const ProfileController = require('../app/controllers/ProfileController');
const UserController = require('../app/controllers/UserController');
const SessionController = require('../app/controllers/SessionController');

const ProfileValidator = require('../app/validator/profile');
const UserValidator = require('../app/validator/user');
const SessionValidator = require('../app/validator/session');
const {onlyUsers, onlyAdmin} = require('../app/middlewares/session');

//login/logout
routes.get('/login', SessionController.loginForm);
routes.post('/login', SessionValidator.login, SessionController.login);
routes.post('/logout', onlyUsers, SessionController.logout);

//reset password / forgot
routes.get('/forgot-password', SessionController.forgotForm);
routes.get('/password-reset', SessionController.resetForm);
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot);
routes.post('/password-reset', SessionValidator.reset, SessionController.reset);
 
//Admin profile
routes.get('/register', ProfileController.registerForm);
routes.post('/register', UserValidator.post, ProfileController.post);
routes.get('/admin/profile', onlyAdmin, UserValidator.show, ProfileController.index);
routes.put('/admin/profile', onlyAdmin, UserValidator.update, ProfileController.put);

//Users profile
routes.get('/admin/users', onlyAdmin, UserController.list);
routes.get('/admin/users/create', onlyAdmin, UserController.create);
routes.post('/admin/users', onlyAdmin, ProfileValidator.post, UserController.post);
routes.get('/admin/users/:id', onlyAdmin, UserController.show);
routes.put('/admin/users', onlyAdmin, UserController.put) // Editar um usuário
routes.get('/admin/users/:id/delete', onlyAdmin, UserController.deletePage);
routes.delete('/admin/users', onlyAdmin, UserController.delete) // Deletar um usuário

module.exports = routes