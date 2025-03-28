from django.contrib.auth import logout
from django.shortcuts import get_object_or_404
from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User, BlogPost, Comment
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    BlogPostSerializer, BlogDetailSerializer,
)
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator

from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken



# Register View 
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Send email verification link
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            verify_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"
            send_mail(
                "Verify Your Email",
                f"Click the link to verify your email: {verify_link}",
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=False
            )
            return Response({"message": "Verification link sent to your email."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#  Verify Email View 
class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uid, token):
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
            if default_token_generator.check_token(user, token):
                user.is_verified = True
                user.save()
                return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)



#login view
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
@method_decorator(csrf_exempt, name="dispatch")
class LoginView(APIView):
    permission_classes = [AllowAny]  # Allow login without authentication
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]

            # Generate tokens using SimpleJWT
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            user_data = UserProfileSerializer(user).data

            return Response(
                {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "user": user_data
                },
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


# Resend verification link
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
@method_decorator(csrf_exempt, name='dispatch')
class ResendVerificationEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            if not user.is_verified:
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = default_token_generator.make_token(user)
                verify_link = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"
                send_mail(
                    "Verify Your Email",
                    f"Click the link to verify your email: {verify_link}",
                    settings.EMAIL_HOST_USER,
                    [user.email],
                    fail_silently=False
                )
                return Response({"message": "Verification link sent successfully."}, status=status.HTTP_200_OK)
            return Response({"error": "Email is already verified."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "No user found with this email."}, status=status.HTTP_400_BAD_REQUEST)
  
        
class GetEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        login_field = request.data.get("login_field")

        user = None
        if "@" in login_field:
            user = User.objects.filter(email=login_field).first()
        elif login_field.isdigit():
            user = User.objects.filter(phone=login_field).first()
        else:
            user = User.objects.filter(username=login_field).first()

        if user:
            return Response({"email": user.email}, status=status.HTTP_200_OK)
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)




# Password Reset Request View
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.get(email=serializer.validated_data['email'])
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
            send_mail(
                "Password Reset",
                f"Click the link to reset your password: {reset_link}",
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=False
            )
            return Response({"message": "Password reset link sent to email"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Password Reset Confirm View 
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        try:
            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=user_id)
            if not default_token_generator.check_token(user, token):
                return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
            serializer = PasswordResetConfirmSerializer(data=request.data)
            if serializer.is_valid():
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


# Access profile 
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#  Logout View
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)


#  Custom Pagination Class
from rest_framework import pagination
class BlogPagination(pagination.PageNumberPagination):
    page_size = 3 
    page_size_query_param = 'page_size'
    max_page_size = 100


#  Create Blog 
class CreateBlogView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BlogPostSerializer

    def get_queryset(self):
        return BlogPost.objects.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


#fetch blog on dashboard without login
class BlogView(generics.ListCreateAPIView):
    serializer_class = BlogPostSerializer

    def get_queryset(self):
        return BlogPost.objects.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

#fetch blog on dashboard and yourblog after login
class BlogListView(generics.ListCreateAPIView):
    queryset = BlogPost.objects.all().order_by('-created_at')
    serializer_class = BlogPostSerializer
    pagination_class = BlogPagination
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticated()]  # Require login for POST requests


# Blog Detail only Authenticate user can access that
class BlogDetailView(APIView):
     # permission_classes = [AllowAny]  

    def get(self, request, pk):
        try:
            blog = BlogPost.objects.get(pk=pk)
            serializer = BlogDetailSerializer(blog, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except BlogPost.DoesNotExist:
            return Response({"detail": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)
        
 
# Blog Delete Authenticate user can do that
class BlogDeleteView(generics.DestroyAPIView):
    queryset = BlogPost.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise PermissionError("You don't have permission to delete this blog.")
        instance.delete()


#  Your Blogs View only Authenticate user can access that
class YourBlogsView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BlogPost.objects.filter(author=self.request.user)
    


#edit Blog
class BlogUpdateView(generics.UpdateAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BlogPost.objects.filter(author=self.request.user)


from .serializers import CommentSerializer
# List Comments (GET)
class ListCommentsView(generics.ListAPIView):
    serializer_class = CommentSerializer
    # permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        blog_id = self.kwargs['blog_id']
        return Comment.objects.filter(blog_id=blog_id).order_by('-created_at')
#  Handle POST for creating a comment
class CreateCommentView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, blog_id):
        blog = get_object_or_404(BlogPost, id=blog_id)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, blog=blog)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete comment
class DeleteCommentView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, blog_id, comment_id):
        comment = get_object_or_404(Comment, id=comment_id, blog__id=blog_id, author=request.user)
        comment.delete()
        return Response({"detail": "Comment deleted successfully."}, status=status.HTTP_204_NO_CONTENT)






