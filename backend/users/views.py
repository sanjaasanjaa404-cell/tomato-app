from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()

def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access':  str(refresh.access_token),
    }

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user   = serializer.save()
            tokens = get_tokens(user)
            return Response({
                'success': True,
                'user':    UserSerializer(user).data,
                'token':   tokens['access'],
                'refresh': tokens['refresh'],
            }, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'message': serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email    = request.data.get('email')
        password = request.data.get('password')
        user     = authenticate(request, email=email, password=password)
        if user:
            tokens = get_tokens(user)
            return Response({
                'success': True,
                'user':    UserSerializer(user).data,
                'token':   tokens['access'],
                'refresh': tokens['refresh'],
            })
        return Response({'success': False, 'message': 'Имэйл эсвэл нууц үг буруу'},
                        status=status.HTTP_401_UNAUTHORIZED)

class ProfileView(generics.RetrieveAPIView):
    serializer_class   = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user