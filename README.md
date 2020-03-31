<h1 align="center">
    <img alt="Foodfy" src="https://github.com/helcioItiyama/Foodfy-Final-Project/blob/master/public/images/logo2.png" width="100px" />
</h1>

## :arrow_right: ABOUT THE PROJECT

This project was developed for the final challenge of the Rocketseat Launchstore course. It is a website where users who register and become administrator can create, change and delete recipes, as well as assign them to a specific chef. They can also create, change and delete profiles of such chefs. In addition, they can invite new users, who can be administrators or not.

Users who are not administrators will only have access to the list and profiles of chefs, list and details of recipes. They will also be able to create, change and delete only the recipes created by himself.

<p align="center">
    <img alt ="recipes list" src="https://github.com/helcioItiyama/Foodfy-Final-Project/blob/master/public/images/Receitas.png" width= "500px"/>
</p>

Therefore, access control for users and administrators is done through a login system.

Users without registration can only view the list and details of recipes and chefs. However, if he wanted to create a recipe, he will be redirected to the login page.

There are two buttons on the login page:

**'Register'**: users will be redirected to a page to fill out a form and create a password for registration;

**'Forgot password?'**: users will be redirected to a page where they can enter an email, where it will be sent the token to create a new password.

<p align="center">
    <img alt ="login" src="https://github.com/helcioItiyama/Foodfy-Final-Project/blob/master/public/images/Login.png" width="500px />
</p>
                                                                                                                             
Users who are administrators can invite friends to use the site. For inviting, they only need to enter the guest's name and email. The guest will receive an invitation via email with a temporary password to access the system.

Only administrators can change or delete other users, including whether or not they can be administrators as well. Administrators can change their profiles, but to delete their account, they must send an email to the website company.

Another restriction is that only chefs without assigned recipes can be deleted.

<p align="center">
    <img alt ="delete restriction" src="https://github.com/helcioItiyama/Foodfy-Final-Project/blob/master/public/images/2020-03-30-20-39-35.gif" width="500px" />
</p>

The website was developed using responsive design to be accessible on all types of devices.

<p align="center">
    <img alt ="responsive design" src="https://github.com/helcioItiyama/Foodfy-Final-Project/blob/master/public/images/2020-03-30-15-58-35.gif" width="500px" />
</p>

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
