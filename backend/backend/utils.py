from api.serializers import UserSerializer

def jwt_response_handler(token, user=None, request=None):
    print("getting response", user, token)
    return {
        'token': token,
        'user': UserSerializer(user, context={'request': request}).data
    }