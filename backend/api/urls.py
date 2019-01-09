from django.conf.urls import url
from django.urls import path
from .views import *
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    path('current-user/', current_user),
    path('token-auth/', obtain_jwt_token),
    path('users/', UserList.as_view()),
    path('workout/create', WorkoutList.as_view({'post': 'create'})),
    path('workout/update', WorkoutList.as_view({'post': 'update'})),
    path('workout/<int:pk>', WorkoutList.as_view({'get': 'retrieve'})),
    path('agenda', AgendaList.as_view({'get': 'list'})),
    path('exercise', ExerciseList.as_view({'get': 'list'})),
    path('exercise/<int:pk>', ExerciseList.as_view({'post': 'update'})),
    path('workout-session', WorkoutSessionList.as_view({'post': 'create'})),
    path('workout-session/<int:pk>', WorkoutSessionList.as_view({'get': 'retrieve', 'post': 'update'})),
    path('in-progress', in_progress_sessions),
    path('workout-session/sets/<int:pk>', CompletedSetList.as_view({'post': 'update', 'delete': 'destroy'})),
    path('workout-session/sets/new', CompletedSetList.as_view({'post': 'create'}))
]