from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User, BlogPost, Comment
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    BlogPostSerializer, BlogDetailSerializer, CommentSerializer
)
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.conf import settings


# ✅ Register View (Restored)
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


# ✅ Verify Email View (Restored)
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


# ✅ Login View (Restored)
# class LoginView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = UserLoginSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.validated_data['user']
#             if user.is_verified:
#                 login(request, user)
#                 access_token = user.tokens()['access']
#                 refresh_token = user.tokens()['refresh']
#                 return Response({
#                     "access": access_token,
#                     "refresh": refresh_token,
#                     "user": {
#                         "id": user.id,
#                         "username": user.username,
#                         "email": user.email,
#                         "profile_picture": user.profile_picture.url if user.profile_picture else None
#                     }
#                 })
#             return Response({"error": "Please verify your email first."}, status=status.HTTP_400_BAD_REQUEST)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("Incoming login data:", request.data)  # ✅ Debugging log
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            if user.is_verified:
                # ✅ Generate JWT tokens using RefreshToken class
                refresh_token = RefreshToken.for_user(user)
                access_token = str(refresh_token.access_token)

                return Response({
                    "access_token": access_token,
                    "refresh_token": str(refresh_token),
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "profile_picture": user.profile_picture.url if user.profile_picture else None
                    }
                }, status=status.HTTP_200_OK)
            return Response({"error": "Please verify your email first."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print("Login serializer errors:", serializer.errors)  # ✅ Debugging log
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Logout View (Restored)
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)


# ✅ User Profile View (Restored)
# class UserProfileView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         serializer = UserProfileSerializer(request.user, context={"request": request})
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def patch(self, request):
#         serializer = UserProfileSerializer(request.user, data=request.data, partial=True, context={"request": request})
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .serializers import UserProfileSerializer

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



# ✅ Create Blog View (Restored)
# class CreateBlogView(generics.CreateAPIView):
#     serializer_class = BlogPostSerializer
#     permission_classes = [IsAuthenticated]

#     def perform_create(self, serializer):
#         serializer.save(author=self.request.user)
from rest_framework import generics, permissions
from .models import BlogPost
from .serializers import BlogPostSerializer

class CreateBlogView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BlogPostSerializer

    def get_queryset(self):
        return BlogPost.objects.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


# ✅ Blog Detail View (Restored)
class BlogDetailView(generics.RetrieveAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogDetailSerializer
    permission_classes = [permissions.AllowAny]


# ✅ Blog Delete View (Restored)
class BlogDeleteView(generics.DestroyAPIView):
    queryset = BlogPost.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise PermissionError("You don't have permission to delete this blog.")
        instance.delete()


# ✅ Your Blogs View (Restored)
class YourBlogsView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BlogPost.objects.filter(author=self.request.user)


# ✅ Password Reset Request View (Restored)
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


# ✅ Password Reset Confirm View (Restored)
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


# # ✅ List Comments View (Fixed)
# class ListCommentsView(generics.ListAPIView):
#     serializer_class = CommentSerializer
#     permission_classes = [permissions.AllowAny]

#     def get_queryset(self):
#         blog_id = self.kwargs.get('blog_id')
#         return Comment.objects.filter(blog_id=blog_id)


# # ✅ Create Comment View (Fixed)
# class CreateCommentView(generics.CreateAPIView):
#     serializer_class = CommentSerializer
#     permission_classes = [IsAuthenticated]

#     def perform_create(self, serializer):
#         blog_id = self.kwargs.get('blog_id')
#         blog = get_object_or_404(BlogPost, pk=blog_id)
#         serializer.save(author=self.request.user, blog=blog)
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import BlogPost, Comment
from .serializers import CommentSerializer

# ✅ List Comments View (GET)
class ListCommentsView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        blog_id = self.kwargs['blog_id']
        return Comment.objects.filter(blog_id=blog_id).order_by('-created_at')

# ✅ Create Comment View (POST)
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import BlogPost, Comment
from .serializers import CommentSerializer
from django.shortcuts import get_object_or_404

# ✅ Handle POST for creating a comment
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



from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Comment

class DeleteCommentView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, blog_id, comment_id):
        comment = get_object_or_404(Comment, id=comment_id, blog__id=blog_id, author=request.user)
        comment.delete()
        return Response({"detail": "Comment deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


from rest_framework import generics, permissions
from .models import BlogPost
from .serializers import BlogPostSerializer

class BlogListView(generics.ListCreateAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]  # ✅ Allow unauthenticated GET requests
        return [permissions.IsAuthenticated()]


