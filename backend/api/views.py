from django.shortcuts import render
from django.views.generic import View
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.conf import settings
import logging
from rest_framework import status, viewsets, permissions, views
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from .serializers import *


@api_view(["GET"])
def current_user(request):
    """
    Determine the current user by their token and return their data
    """

    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(["GET"])
def in_progress_sessions(request):
    """
    Get in progress sessions
    """

    session = WorkoutSession.objects.filter(completed=False).order_by('created_at')
    if session:
        serializer = WorkoutSessionSerializer(session[0])
        return Response(serializer.data, status=200)
    return Response({}, status=404)


class AgendaList(viewsets.ModelViewSet):
    """
    Get workouts
    """
    serializer_class = AgendaSerializer
    queryset = Workout.objects.all()

    def list(self, request):
        user = User.objects.get(username=request.user)
        agenda = Workout.objects.raw("""SELECT api_workout.id, api_workoutevent.weekday, api_workout.name, COUNT(api_exercise.id) as exercise_count
                                            FROM api_workout 
                                            INNER JOIN api_exercise ON api_exercise.workout_id=api_workout.id 
                                            INNER JOIN api_workoutevent ON api_workoutevent.workout_id=api_workout.id 
                                            WHERE api_workout.user_id=%d
                                            GROUP BY api_workout.id, api_workoutevent.weekday
                                            ORDER BY api_workoutevent.weekday ASC;""" % user.id)
        serializer = self.get_serializer(agenda, many=True)
        return Response(serializer.data)

class UserList(views.APIView):
    """
    Create a new user
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ExerciseList(viewsets.ModelViewSet):
    """
    Get exercises
    """
    serializer_class = ExerciseListSerializer
    queryset = Exercise.objects.all()
    lookup_url_kwarg = 'pk'

    def list(self, request):
        user = User.objects.get(username=request.user)
        exercises = Exercise.objects.raw("""SELECT 0 as id, api_exercise.name, MAX(api_exercise.weight) as weight, 
                                                    COUNT(api_workout.id) as workout_count
                                                    FROM api_exercise
                                                    INNER JOIN api_workout ON api_exercise.workout_id=api_workout.id
                                                    WHERE api_workout.user_id=%d
                                                    GROUP BY api_exercise.name;""" % user.id)
        serializer = self.get_serializer(exercises, many=True)
        return Response(serializer.data, status=200)

    def update(self, request, pk=None):
        exercise = Exercise.objects.get(pk=pk)
        if exercise:
            exercise.weight = request.data['weight']
            exercise.save()
            return Response({}, status=200)
        return Response({}, status=400)


class WorkoutList(viewsets.ModelViewSet):
    """
    Get/udate/create 
    """
    serializer_class = WorkoutSerializer
    queryset = Workout.objects.all()
    lookup_url_kwarg = 'pk'

    def create(self, request):
        user = User.objects.get(username=request.user)
        workout = WorkoutSerializer(data={'name': request.data['name']})
        if workout.is_valid():
            workout.save(user=user)
        else:
            Response(workout.errors, status=500)
    
        for ex in request.data['exercises']:
            exercise = ExerciseSerializer(data=ex)
            if exercise.is_valid():
                exercise.save(workout=workout.instance)
            else:
                Response(exercise.errors, status=500)
        
        for day in request.data['weekdays']:
            weekday = WorkoutEventSerializer(data={'weekday': day})
            if weekday.is_valid():
                weekday.save(workout=workout.instance)
            else:
                Response(weekday.errors, status=500)

        return Response({}, status=200)
    
    
    def update(self, request, pk=None):
        workout = Workout.objects.get(pk=request.data['id'])
        workout.name = request.data['name']
        workout.save()

        all_exercises = []
        for ex in request.data['exercises']:
            all_exercises.append(ex['name'])
            exercise = Exercise.objects.filter(workout__id=workout.id, name=ex['name'])
            if exercise:
                exercise = exercise[0]
                exercise.name = ex['name']
                exercise.weight = ex['weight']
                exercise.sets = ex['sets']
                exercise.reps = ex['reps']
                exercise.save()
            else:
                exercise = Exercise(name=ex['name'],
                                    weight=ex['weight'],
                                    sets=ex['sets'],
                                    reps=ex['reps'],
                                    workout=workout)
                exercise.save()
        missing = Exercise.objects.filter(workout=workout).exclude(name__in=all_exercises).delete()


        weekday = WorkoutEvent.objects.filter(workout__id=workout.id).delete()
        for day in request.data['weekdays']:            
            weekday = WorkoutEvent(weekday=day, workout=workout)
            weekday.save()
        
        return Response({}, status=200)


    def retrieve(self, request, pk=None):
        workout = Workout.objects.filter(pk=pk).prefetch_related('exercises', 'weekdays')
        serializer = self.get_serializer(workout, many=True)
        return Response(serializer.data[0], status=200)


class WorkoutSessionList(viewsets.ModelViewSet):
    """
    Get/udate/create 
    """
    serializer_class = WorkoutSessionSerializer
    queryset = WorkoutSession.objects.all()

    def create(self, request):
        workout = Workout.objects.get(pk=request.data['workoutId'])
        session = WorkoutSession(workout=workout)
        session.save()
        for exercise in workout.exercises.all():
            completed = CompletedExercise(exercise=exercise, workout_session=session)
            completed.save()
        serializer = self.get_serializer(session, many=False)
        return Response(serializer.data, status=200)
    
    def update(self, request, pk=None):
        session = WorkoutSession.objects.get(pk=pk)
        session.completed = request.data['completed']
        session.save()
        serializer = self.get_serializer(session, many=False)
        return Response(serializer.data, status=200)


class CompletedSetList(viewsets.ModelViewSet):
    serializer_class = CompletedSetSerializer
    queryset = CompletedSet.objects.all()

    def create(self, request):
        exercise = CompletedExercise.objects.get(pk=request.data['exerciseId']);
        cset = CompletedSet(reps=request.data['reps'], exercise=exercise)
        cset.save()
        serializer = self.get_serializer(cset, many=False)
        return Response(serializer.data, status=200)
