# Okta - Set new password
In the context of a CIAM use-case. A user is being created without credentials via the API.
In the same API call, the user is set to be activated. 
Making such a call will set the user status to PROVISIONED, waiting for the password to be set and send an activation email to the user.
When the user will click on the link in the activation email, the user should be redirected to an Okta page in order to set the password.
In this use-case, we want to make usage of the email that is begin sent by Okta but use our own page in order to set the password.
## Getting Started
### Prerequisites
This repository is a Node.JS project using the following main node modules:
- Express: For HTTP requests
- Handlebars:  For rendering webpages
- Axios: For API call to Okta 

One of the prerequisite for this is of course to have NPM installed on your computer.

You will also need two environment variables BASEURL and APIKEY.  
BASEURL is your tenant URL (e.g. https://your-tenant.okta.com/api/v1)
APIKEY is the key generated from your Okta Admin > Security > API > Tokens > Create Token. Give it a name and use the give value as APIKEY.

### Installing
Clone or Download the project and in a terminal in the project's folder, run the following command:
```
npm init
```
In the project's folder, create a new .env (if not already created).  
Add the two variables BASEURL APIKEY and copy/paste their respective values.

When the node modules have been installed, run the project with the following command:
```
npm start
```
### Customize email
1. Log into your Okta Admin Panel
2. Goto Setting > Emails & SMS
3. Edit the User Activation template

Here you can define the email template as you want. 
What is important here is to modify the reset password link. If you are running the project locally it should look like this:
```
http://localhost:3000/set-new-password?recoveryToken=${activationToken}
```
### Tests
First we will trigger the user creation by an API call. 
Make sure you have access to the mailbox for the email you will define
####Request:
```
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com"
  }
}' "https://${yourOktaDomain}/api/v1/users?activate=true"
```
####Response
The response should show that the user has been created and that the status is set to PROVISIONED.

Open the user's mailbox, see the activation email. Click on the button that opens the reset password link
You should be redirected to your application where you can define the user's password.
