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
    return render_page()


@app.route("/example/<name>/")
def example(name):
        
    with open("templates/example/{}.json".format(name), "r") as fd:
        code = fd.read()

    return code


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
