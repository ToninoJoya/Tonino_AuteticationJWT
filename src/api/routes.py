"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from base64 import b64encode
import os

api = Blueprint('api', __name__)

def set_password(password, salt): 
    return generate_password_hash(f"{password}{salt}")


def check_password(pass_hash, password, salt):
    return check_password_hash(pass_hash, f"{password}{salt}")


# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route("/register", methods = ["POST"])
def add_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    lastname = data.get("lastname")
    salt = b64encode(os.urandom(32)).decode("utf-8")

    if email is None or password is None or lastname is None:
        return jsonify("Necesitas un email, password y lastname"), 400
    
    user = User(email = email, lastname = lastname, password = set_password(password, salt), salt = salt)

    db.session.add(user)
    try:
        db.session.commit()
        return jsonify("Trabajando para usted")
    except Exception as error: 
        db.session.rollback()
        return jsonify(f"Error : {error.args}"), 500

@api.route("/login", methods= ["POST"])
def handle_login():

    data = request.json
    email = data.get("email", None)
    password = data.get("password", None)

    if not email  or not password:
        return jsonify("Necesitamos Email y password")
    else:
        user = User.query.filter_by(email=email).first()
        if not user: 
            return jsonify("Bad credentials"), 400
        else:
            if check_password(user.password, password, user.salt):
                #debemos generar el token
                return jsonify("haciendo todo lo posible"), 201
            else:
                return jsonify("Bad credentials"), 400

