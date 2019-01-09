from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
from api.models import *

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username',)


class UserSerializerWithToken(serializers.ModelSerializer):

    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        
        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    
    class Meta:
        model = User
        fields = ('token', 'username', 'password')


class WorkoutBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ('id', 'name')


class WorkoutEventSerializer(serializers.ModelSerializer):
    workout = serializers.StringRelatedField(required=False, many=False)

    class Meta:
        model = WorkoutEvent
        fields = ('weekday', 'workout')


class ExerciseSerializer(serializers.ModelSerializer):
    workout = serializers.StringRelatedField(required=False, many=False)

    class Meta:
        model = Exercise
        fields = ('id', 'name', 'workout', 'weight', 'sets', 'reps')


class WorkoutSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False, many=False)
    weekdays = WorkoutEventSerializer(required=False, many=True)
    exercises = ExerciseSerializer(required=False, many=True)

    class Meta:
        model = Workout
        fields = ('name', 'user', 'exercises', 'weekdays')


class AgendaSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    weekday = serializers.IntegerField()
    name = serializers.CharField(max_length=200)
    exercise_count = serializers.IntegerField()

    class Meta:
        fields = ('id', 'weekday', 'name', 'exercise_count')

class ExerciseListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=200)
    weight = serializers.IntegerField()
    workout_count = serializers.IntegerField()

    class Meta:
        fields = ('id', 'name', 'weight', 'workouts')


class CompletedSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompletedSet
        fields = ('id', 'reps')


class CompletedExerciseSerializer(serializers.ModelSerializer):
    sets = CompletedSetSerializer(required=False, many=True)
    exercise = ExerciseSerializer(required=True, many=False)

    class Meta:
        model = CompletedExercise
        fields = ("id", "exercise", "sets")


class WorkoutSessionSerializer(serializers.ModelSerializer):
    workout = WorkoutBaseSerializer(required=True, many=False)
    exercises = CompletedExerciseSerializer(required=False, many=True)
    
    class Meta:
        model = WorkoutSession
        fields = ('id', 'workout', 'completed', 'exercises')







