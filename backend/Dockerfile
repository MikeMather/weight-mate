FROM python:3.7
MAINTAINER Mike Mather

RUN apt-get update

WORKDIR /fytics/backend
ADD ./requirements.txt /fytics/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r /fytics/requirements.txt

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
