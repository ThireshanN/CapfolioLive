
# Capfolio #

The link to deployed version. [https://www.capfolio.live](https://www.capfolio.live)
Also an alternative URL for our deployed version: [http://ec2-54-79-153-66.ap-southeast-2.compute.amazonaws.com:3000](http://ec2-54-79-153-66.ap-southeast-2.compute.amazonaws.com:3000)

---
## PM Tool - INCOMPLETE ##
---

A link to your Project Management tool.

---
## Project description: ##
---

Capfolio, developed by WebZen, is a transformative platform that revolutionizes the computer science capstone course experience. It offers a comprehensive range of functionalities designed to enhance project showcasing and communication. With Capfolio, students can upload their capstone projects, including comprehensive details such as project titles, descriptions, images, YouTube videos, and GitHub repositories. These features allow students to accurately represent their work and attract the attention of potential employers and clients.

Furthermore, Capfolio provides a user-friendly interface for visitors, students, and administrators. Visitors have the option to create an account through a streamlined signup process or utilize Google OAuth for seamless sign-in. Students, particularly those affiliated with the University of Auckland, can log in directly using their university email addresses. The platform distinguishes between user types, granting specific privileges and access levels to guests, students, and administrators.

For administrators, Capfolio offers a robust admin panel that enables them to review and manage student projects. They have the authority to refine project details, assign awards to outstanding projects, and approve them for public display. This ensures the quality and appropriateness of showcased projects.

Overall, Capfolio empowers students to showcase their capstone projects to a global audience, facilitates direct communication and engagement with employers and clients, and provides administrators with effective project management tools. The platform's comprehensive functionalities and user-friendly interface make it an invaluable tool for bridging the gap between academia and industry, fostering meaningful connections, and propelling students' career opportunities in the field of computer science.

---
## Technologies used ##
---

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

---
## Dependencies and installation ##
---

From the root directory:
```
npm run buildstart
```

### Possible Errors encountered and there fixes: ###

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
```

---
## Usage Examples ##
---

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

---
## Acknowledgements - INCOMPLETE ##
---

Acknowledgements (if any) - You can list tutorials used, projects referred to, people consulted etc.

---
## Future insight: - PROBZ NEED TO ADD MORE ##
---

* Allow employers to submit potential projects for our client to approve and stendents to work on
* Enable a bidding system for students for choosing project preference
* Implement a messaging system that allows all users to communicate privately and securely.
* Implement a subsystem that allows students to create, search for and join teams. 
* Live updates
      * Implement a feature where any updates to a students projects, clients projects, messages, approvals needing done by the admin are either emailed or pop up as a phone notification








