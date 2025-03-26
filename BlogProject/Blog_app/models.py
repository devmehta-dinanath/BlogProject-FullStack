from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from ckeditor.fields import RichTextField

# Define phone number validation (only 10 digits allowed)
phone_regex = RegexValidator(
    regex=r'^\d{10}$',
    message="Phone number must be exactly 10 digits."
)

# Custom User Model 
class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True) 
    phone = models.CharField(validators=[phone_regex], max_length=10, unique=True, null=True,blank=True ) 
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)  #  Allow null and blank
    is_verified = models.BooleanField(default=False)  # field  is Required for email verification


    def __str__(self):
        return self.username

# Blog Post Model
class BlogPost(models.Model):
    id=models.AutoField(primary_key=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)  # Link to User model
    title = models.CharField(max_length=200)
    content = RichTextField()
    image = models.ImageField(upload_to='blog_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return self.title
    

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Comment(models.Model):
    blog = models.ForeignKey('BlogPost', on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.username}: {self.content}"

