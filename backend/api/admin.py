from django.contrib import admin
from api.models import *

# Register your models here.
admin.site.register(Workout)
admin.site.register(WorkoutEvent)
admin.site.register(Exercise)
admin.site.register(CompletedSet)
admin.site.register(WorkoutSession)
admin.site.register(CompletedExercise)