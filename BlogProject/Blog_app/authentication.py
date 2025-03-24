from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomAuthBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        user = None
        if username:
            if "@" in username:
                user = User.objects.filter(email=username).first()
            elif username.isdigit():
                user = User.objects.filter(phone=username).first()
            else:
                user = User.objects.filter(username=username).first()

            if user and user.check_password(password):
                return user
        return None
