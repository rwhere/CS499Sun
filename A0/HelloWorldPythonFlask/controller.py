from flask import Flask

app = Flask(__name__)

@app.route("/a0")
def helloWorld():
    return "Hello, world!"

if __name__ == "__main__":
    app.run();