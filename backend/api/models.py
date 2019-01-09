from django.db import models
from django.contrib.auth.models import User

class Workout(models.Model):
    name = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    created_at = models.DateTimeField(auto_now_add=True)

class WorkoutEvent(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, default=None, related_name='weekdays')
    weekday = models.IntegerField(default=1)

class Exercise(models.Model):
    name = models.CharField(max_length=75)
    weight = models.IntegerField(default=20)
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, default=None, related_name='exercises')
    sets = models.IntegerField(default=0)
    reps = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class WorkoutSession(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='workout_sessions')
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class CompletedExercise(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, default=None, related_name='completed_exercises')
    workout_session = models.ForeignKey(WorkoutSession, on_delete=models.CASCADE, default=None, related_name='exercises')
    created_at = models.DateTimeField(auto_now_add=True)

class CompletedSet(models.Model):
    exercise = models.ForeignKey(CompletedExercise, on_delete=models.CASCADE, default=None, related_name='sets')
    reps = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)