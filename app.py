import uuid
import os
import json

from flask import Flask, render_template, abort, request, redirect, url_for
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]

def render_page(root="templates/example"):
    return render_template("index.html", examples=load_examples())

@app.route("/", methods=("GET", "POST"))
def index():
    if request.method == "POST":
        return custom()
    return render_page()


@app.route("/example/<name>/", methods=("GET", "POST"))
def example(name):
    if request.method == "POST":
        return custom()
        
    with open("templates/example/{}.json".format(name), "r") as fd:
        code = fd.read()

    return code


@app.route("/custom/<uuid:id>/", methods=("GET", "POST"))
@app.route("/custom/", methods=("GET", "POST"))
def custom(id=None):
    if request.method == "POST":
        if id is None:
            id = uuid.uuid4()
        with open("custom/{}.txt".format(id), "w") as fd:
            fd.write(request.form["code"])
        return redirect(url_for("custom", id=id))
    return render_page(id, root="custom")


def load_examples():
    path = os.path.join("templates", "example")
    for f in os.listdir(path):
        filename, _ = os.path.splitext(f)
        with open(os.path.join(path, f), "r") as fd:
            example_data = json.load(fd)

            if not "name" in example_data:
                name = filename.split()
            else:
                name = str(example_data["name"])

            yield {"name": name, "filename": filename}

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
