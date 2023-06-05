
# Capfolio #

The link to deployed version. [https://www.capfolio.live](https://www.capfolio.live)

Also an alternative URL for our deployed version: [http://ec2-54-79-153-66.ap-southeast-2.compute.amazonaws.com:3000](http://ec2-54-79-153-66.ap-southeast-2.compute.amazonaws.com:3000)

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
## PM Tool -
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

A link to your Project Management tool: 
DISCLAIMER: PLEASE LOGIN USING GOOGLE TO ACCESS NOTION TOOL
https://www.notion.so/a3ba2f0d40ce42068c40c6d9f0d5d088?v=cabc49691dc6494e810ac4d6431616b7&pvs=4

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
## Project description: ##
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Capfolio, developed by WebZen, is a transformative platform that revolutionizes the computer science capstone course experience. It offers a comprehensive range of functionalities designed to enhance project showcasing and communication. With Capfolio, students can upload their capstone projects, including comprehensive details such as project titles, descriptions, images, YouTube videos, and GitHub repositories. These features allow students to accurately represent their work and attract the attention of potential employers and clients.

Furthermore, Capfolio provides a user-friendly interface for visitors, students, and administrators. Visitors have the option to create an account through a streamlined signup process or utilize Google OAuth for seamless sign-in. Students, particularly those affiliated with the University of Auckland, can log in directly using their university email addresses. The platform distinguishes between user types, granting specific privileges and access levels to guests, students, and administrators.

For administrators, Capfolio offers a robust admin panel that enables them to review and manage student projects. They have the authority to refine project details, assign awards to outstanding projects, and approve them for public display. This ensures the quality and appropriateness of showcased projects.

Overall, Capfolio empowers students to showcase their capstone projects to a global audience, facilitates direct communication and engagement with employers and clients, and provides administrators with effective project management tools. The platform's comprehensive functionalities and user-friendly interface make it an invaluable tool for bridging the gap between academia and industry, fostering meaningful connections, and propelling students' career opportunities in the field of computer science.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
## Technologies used ##
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

- AWS --> EC2, S3, RDS
- JavaScript
- Node.js
- Express.js
- CSS
- HTML
- React
- SQL
- GoogleOAuth 2.0
- Bootstrap

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
## Dependencies and installation ##
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

From the root directory (EC2 instance):
```
cd project-team-11
cd capfolio && npm run build
pm2 restart app.js
```
then navigate to https://www.capfolio.live or https://capfolio.live


From the root directory (locally):
```
cd project-team-11
npm run buildstart
```
then navigate to localhost:3000


### Possible Errors encountered and their fixes: ###

If you get this error message: "Plugin "react" was conflicted between package.json » eslint-config-react-app"
```
# FOR WINDOWS

cd Capfolio
rd /s /q "node_modules"
del package-lock.json
del -f yarn.lock
npm cache clean --force
cd ..
rd /s /q "node_modules"
del package-lock.json
del -f yarn.lock
npm cache clean --force
npm i nodemailer
npm run buildstart

# FOR MAC

cd Capfolio
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
npm cache clean --force
cd ..
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
npm cache clean --force
npm i nodemailer
npm run buildstart
```

If you get this error message: "Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'nodemailer'"

```
npm i nodemailer
npm run buildstart
```

If you get this error message: "sh: line 1: /home/ec2-user/project-team-11/capfolio/node_modules/.bin/react-scripts: Permission denied"

```
sudo chmod +x /home/ec2-user/project-team-11/capfolio/node_modules/.bin/react-scripts
```

if you get a 'NODE_MODULES NOT FOUND' error:
```
cd capfolio && npm i
cd ..
cd backend && npm i

```

---
## Usage Examples ##
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

* Home Gallery Page
![image](https://github.com/uoa-compsci399-s1-2023/project-team-11/assets/48738772/c570e550-8b99-45d8-bcba-47ee42f1ee5b)
![image](https://github.com/uoa-compsci399-s1-2023/project-team-11/assets/48738772/1ed398e3-0276-4b38-ba96-9918b2bd047a)

* Sign Up page
![image](https://github.com/uoa-compsci399-s1-2023/project-team-11/assets/48738772/47edebf0-537b-4839-888a-b4dd71e5cc23)

* Code Confirmation Page 
![image](https://github.com/uoa-compsci399-s1-2023/project-team-11/assets/48738772/01e248e5-59d7-4270-a06b-c328816cb761)

* Login Page 
![image](https://github.com/uoa-compsci399-s1-2023/project-team-11/assets/48738772/48c2b271-7a26-453d-aa15-deb2196e6b0f)

* Forgot Password Page
![image](https://github.com/uoa-compsci399-s1-2023/project-team-11/assets/48738772/c37cf95f-96fd-4455-8ad3-7934beaa3ded)

* Reset Password Page
![image](https://github.com/uoa-compsci399-s1-2023/project-team-11/assets/48738772/b1c9ebd3-f795-4341-813b-1056121e0d89)

* Project View Page
![image](https://github.com/uoa-compsci399-s1-2023/project-team-11/assets/48738772/053bd933-c817-4a84-aaab-d6972c610604)
![image](https://github.com/uoa-compsci399-s1-2023/project-team-11/assets/48738772/1da0f5f8-4ff1-4ac7-aaf0-267448ec19e6)
![image](https://github.com/uoa-compsci399-s1-2023/project-team-11/assets/48738772/2787c81f-64c0-4e0c-b820-88241e285e1d)

THE PDF IS NOT SHOWING WE NEED TO FIX THAT

* Profile Page
![image](https://github.com/uoa-compsci399-s1-2023/project-team-11/assets/48738772/d96550af-8ed7-479d-ab05-9df23319619c)

* Project Submit Page
![image](https://github.com/uoa-compsci399-s1-2023/project-team-11/assets/48738772/be62a085-56a9-492d-974b-1dea6fa4fe38)

* Admin Panel 
![image](https://github.com/uoa-compsci399-s1-2023/project-team-11/assets/48738772/f7d8dde9-9e8e-4fe3-8db1-5b70a332b512)
![image](https://github.com/uoa-compsci399-s1-2023/project-team-11/assets/48738772/0f2340a8-021a-474b-be63-4ba2eed4db66)

* Admin Project Approval Page
![image](https://github.com/uoa-compsci399-s1-2023/project-team-11/assets/48738772/42dae11b-4014-468f-ab99-5a873389fef9)
![image](https://github.com/uoa-compsci399-s1-2023/project-team-11/assets/48738772/483eef1b-6fcb-4127-a0d2-41b1d9a0a4f6)


------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
## URL:
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
https://www.capfolio.live
https://capfolio.live
https://ec2-54-79-153-66.ap-southeast-2.compute.amazonaws.com/


------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
## Future insight: ##
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

* Allow employers to submit potential projects for our client to approve and stendents to work on
* Enable a bidding system for students for choosing project preference
* Implement a messaging system that allows all users to communicate privately and securely.
* Implement a subsystem that allows students to create, search for and join teams. 
* Live updates - Implement a feature where any updates to a students projects, clients projects, messages, approvals needing done by the admin are either emailed or pop up as a phone notification


------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
## Acknowledgements:
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

- [How to Deploy a Node.js Application On AWS EC2 Server](https://ourcodeworld.com/articles/read/977/how-to-deploy-a-node-js-application-on-aws-ec2-server)

- [Using AWS RDS with Node.js and Express.js](https://stackabuse.com/using-aws-rds-with-node-js-and-express-js/)

- [How to Set up a Node.js Express Server for React | Engineering Education (EngEd)](https://www.section.io/engineering-education/how-to-setup-nodejs-express-for-react/)

- [Node React Tutorial - How to connect React with backend Node.js?](https://codedamn.com/news/reactjs/how-to-connect-react-with-node-js)

- [Creating Amazon EC2 Instances for NGINX Open Source and NGINX Plus](https://docs.nginx.com/nginx/deployment-guides/amazon-web-services/ec2-instances-for-nginx/)

- [React Doc](https://legacy.reactjs.org/docs/getting-started.html) 

- [MUI Library Doc](https://mui.com/material-ui/getting-started/overview/)

- https://sehannrathnayake.medium.com/how-to-handle-mysql-database-transactions-with-nodejs-b7a2bf1fd203 
- https://stackabuse.com/using-aws-rds-with-node-js-and-express-js/
- https://javascript.plainenglish.io/how-to-use-an-aws-sql-database-with-node-js-and-mysql-workbench-f77a71ac12be
- https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
- https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
- https://blog.logrocket.com/modern-api-data-fetching-methods-react/
- https://www.youtube.com/watch?v=DYqfdw4Kvbg&ab_channel=HyperBall
- https://www.linkedin.com/pulse/how-integrate-third-party-dns-provider-route-53-milad-rezaeighale
- https://betterprogramming.pub/setup-nginx-for-your-nodejs-server-on-ec2-ae46a3d0cb1b
- https://www.coderrocketfuel.com/article/default-nginx-configuration-file-inside-sites-available-default
- https://antonlytvynov.medium.com/nginx-sites-available-sites-enabled-3bd025bc4d25









