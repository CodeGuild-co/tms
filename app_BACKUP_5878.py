import os
import json

from flask import Flask, render_template, abort
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]

def render_page(root="templates/example"):
    return render_template("index.html", examples=load_examples())

@app.route("/")
def index():
<<<<<<< HEAD
    if request.method == "POST":
        return custom()
    return render_page()
=======
    return render_page("print-all-the-ones")
>>>>>>> fc747a3207c6028ec294ab0205bc275b5ee34662


@app.route("/example/<name>/")
def example(name):
<<<<<<< HEAD
    if request.method == "POST":
        return custom()
        
    with open("templates/example/{}.json".format(name), "r") as fd:
        code = fd.read()

    return code
=======
    return render_page(name)
>>>>>>> fc747a3207c6028ec294ab0205bc275b5ee34662


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
