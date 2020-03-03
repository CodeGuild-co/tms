import uuid
import os

from flask import Flask, render_template, abort, request, redirect, url_for
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]


def render_page(name, root="templates/example"):
    try:
        with open("{}/{}.txt".format(root, name), "r") as fd:
            code = fd.read()
    except FileNotFoundError:
        abort(404)
    return render_template("index.html", examples=load_examples(), code=code)


@app.route("/")
def index():
    return render_page("print-all-the-ones")


@app.route("/example/<name>/")
def example(name):
    return render_page(name)


def load_examples():
    path = os.path.join("templates", "example")
    for f in os.listdir(path):
        with open(os.path.join(path, f), "r") as fd:
            for l in fd.readlines():
                if l.startswith("name:"):
                    filename, _ = os.path.splitext(f)
                    yield {"name": l[5:].strip(), "filename": filename}
                    break


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
