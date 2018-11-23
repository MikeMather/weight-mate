FROM python:3.7
MAINTAINER Mike Mather

RUN apt-get update

WORKDIR /fytics/backend
ADD ./requirements.txt /fytics/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r /fytics/requirements.txt

EXPOSE 8000
CMD ["gunicorn", "backend.wsgi:application", "-w", "2", "-b", ":8000"]