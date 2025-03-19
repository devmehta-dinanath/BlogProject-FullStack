from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from .models import BlogPost, Comment
from .models import User


User = get_user_model()


# Registration Serializer
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'phone', 'password']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email already exists.")
        return value

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Phone number already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['username'],
            email=validated_data['email'],
            phone=validated_data['phone'],
            password=validated_data['password']
        )
        return user

# login Serializer
class UserLoginSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)  
    login_field = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        login_field = data.get("login_field")
        password = data.get("password")

        if not login_field:
            raise serializers.ValidationError("Login field is required.")
        if not password:
            raise serializers.ValidationError("Password is required.")

        #  Authenticate using the custom backend
        user = authenticate(username=login_field, password=password)

        if user:
            if not user.is_active:
                raise serializers.ValidationError("This account is inactive. Please contact support.")
            if not user.is_verified:
                raise serializers.ValidationError("Please verify your email first.")
            return {"user": user}

        raise serializers.ValidationError("Invalid credentials.")

# profile Serilizer
class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'phone', 'profile_picture','id']

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.phone = validated_data.get('phone', instance.phone)

        # Handle profile picture update
        profile_picture = validated_data.get('profile_picture', None)
        if profile_picture:
            instance.profile_picture = profile_picture

        instance.save()
        return instance


#  Password Reset Request Serializer
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, data):
        email = data.get("email")
        user = User.objects.filter(email=email).first()
        if not user:
            raise serializers.ValidationError("No user with this email found.")
        return data


# Password Reset Confirm Serializer 
class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")
        return data

# Blog post serializer
class BlogPostSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username', read_only=True)
    author_id = serializers.IntegerField(write_only=True)
    image = serializers.ImageField(required=False)  
    created_at = serializers.DateTimeField(read_only=True)
    comments = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'content', 'image', 'author', 'author_id', 'created_at', 'comments']

    def get_comments(self, obj):
        comments = obj.comments.all()
        return CommentSerializer(comments, many=True).data
    
    def create(self, validated_data):
        # Handle file upload and create BlogPost
        author_id = validated_data.pop('author_id')
        user = self.context['request'].user

        blog_post = BlogPost.objects.create(
            author_id=author_id,
            **validated_data
        )
        return blog_post

    
    def get_comments(self, obj):
        comments = obj.comments.all()
        return CommentSerializer(comments, many=True).data
    
    def get_comment_count(self, obj):
        return obj.comments.count()

#  Blog Detail Serializer
class BlogDetailSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source='author.username', read_only=True)
    image = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'content', 'image', 'author', 'created_at', 'updated_at', 'comments']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None
    
    def get_comments(self, obj):
        comments = obj.comments.all()
        return CommentSerializer(comments, many=True).data

# comment
class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'created_at']


    def create(self, validated_data):
        return Comment.objects.create(**validated_data)

