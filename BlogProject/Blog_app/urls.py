from django.urls import path
from .views import (
    RegisterView, VerifyEmailView, LoginView, LogoutView,
    CreateBlogView, BlogDetailView, BlogDeleteView, UserProfileView,
    YourBlogsView, PasswordResetRequestView, PasswordResetConfirmView,
    CreateCommentView, ListCommentsView, DeleteCommentView,ResendVerificationEmailView,
    GetEmailView,BlogView,BlogUpdateView,
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/verify-email/<uid>/<token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('auth/password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('auth/password-reset/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('auth/resend-verification-email/', ResendVerificationEmailView.as_view(), name='resend-verification-email'),
    path('auth/get-email/', GetEmailView.as_view(), name='get-email'),

    path('blogs/', CreateBlogView.as_view(), name='create-blog'),
    path('getblogs/', BlogView.as_view(), name='create-blog'), 
    # path('viewblogs/', DetailView.as_view(), name='blog-detail'),
     path('blogs/<int:pk>/', BlogDetailView.as_view(), name='blog-detail'),
    path('blogs/<int:pk>/delete/', BlogDeleteView.as_view(), name='blog-delete'),
    path('blogs/<int:pk>/update/', BlogUpdateView.as_view(), name='update-blog'),
    # path('blogs/<int:pk>/update/', BlogUpdateView.as_view(), name='blog-update'),



    path('profile/', UserProfileView.as_view(), name='profile'),

    # Separate GET and POST for comments
    path('blogs/<int:blog_id>/comments/', ListCommentsView.as_view(), name='list-comments'),
    path('blogs/<int:blog_id>/comments/create/', CreateCommentView.as_view(), name='create-comment'),
    #DELETE endpoint for comments
    path('blogs/<int:blog_id>/comments/<int:comment_id>/', DeleteCommentView.as_view(), name='delete-comment'),

    path('your-blogs/', YourBlogsView.as_view(), name='your-blogs'),
]
