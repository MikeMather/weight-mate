from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse
from django.http import JsonResponse
from django.conf import settings
import logging
import os

def index(request, *args):
    try:
        with open(os.path.join(settings.BASE_DIR, 'static', 'index.html')) as f:
            return HttpResponse(f.read())
    except FileNotFoundError:
        logging.exception("Production build of app not found")
        return HttpResponse(
            """
            THIS URL is only used when you have build the production version of the app. Visit http://localhost:3000/ instead
            or build by running 'yarn run build' to test the production version
            """,
            status=501
        )

def test(request, *args):
    return JsonResponse({"msg": "This is the result of a connection between client/server"})
