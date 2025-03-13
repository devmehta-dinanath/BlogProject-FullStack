# Blog Project




For user Registeration Testing API 
in JSON format

POST--> http://127.0.0.1:8000/api/auth/register/

{
    "first_name": "",
    "last_name": "",
    "username": "",
    "email": "@gmail.com",
    "phone": "",
    "password": ""
}

For user Login API Testing 

POST --> http://127.0.0.1:8000/api/auth/login/

{
    "login_field": "ths could be username , phonenumber , email",
    "password": "mehta"
}



POST--> http://127.0.0.1:8000/api/auth/logout/