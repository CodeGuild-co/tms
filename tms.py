import uuid
import os
import redis

from flask import Flask, render_template, abort, request, jsonify

app = Flask(__name__)
r = redis.StrictRedis.from_url(os.environ['REDIS_URL'], decode_responses=True)


@app.route("/")
def index():
    return render_template("index.html", examples=load_examples())


@app.route("/examples/<name>/")
def get_example(name):
    try:
        return jsonify(code=render_template("examples/{}.txt".format(name)))
    except:
        abort(404)


@app.route("/load/<id>/")
def list_custom(id):
    return jsonify(names=r.hkeys(id))


@app.route("/load/<id>/<name>/")
def load_custom(id, name):
    return jsonify(code=r.hget(id, name))


@app.route('/save/', methods=['POST'])
@app.route('/save/<id>/', methods=['POST'])
def save(id=None):
    if id is None:
        id = uuid.uuid4()
    code = request.get_json()['code']
    for l in code.splitlines():
        if l.startswith('name:'):
            name = l[5:].strip()
            break
    r.hset(id, name, code)
    return jsonify(id=id, name=name)


def load_examples():
    path = os.path.join("templates", "examples")
    for f in os.listdir(path):
        with open(os.path.join(path, f), 'r') as fd:
            for l in fd.readlines():
                if l.startswith('name:'):
                    filename, _ = os.path.splitext(f)
                    yield {'name': l[5:].strip(), 'filename': filename}
                    break


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
