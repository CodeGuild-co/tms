FROM python:3.6-onbuild

CMD ["gunicorn", "tms:app", "--log-file", "-", "--bind", "0.0.0.0:80"]
