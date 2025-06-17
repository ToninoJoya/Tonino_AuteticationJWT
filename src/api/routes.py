"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException, send_email
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from base64 import b64encode
import os
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from datetime import timedelta

api = Blueprint('api', __name__)

def set_password(password, salt): 
    return generate_password_hash(f"{password}{salt}")


def check_password(pass_hash, password, salt):
    return check_password_hash(pass_hash, f"{password}{salt}")

expire_minutes = 20
expire_delta = timedelta(minutes=expire_minutes)


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

    if not email or not password:
        return jsonify("Necesitamos Email y password"), 400
    else:
        user = User.query.filter_by(email=email).first()
        if not user: 
            return jsonify("Bad credentials"), 400
        else:
            if check_password(user.password, password, user.salt):
                #debemos generar el token
                token = create_access_token(identity = str(user.id))
                return jsonify({
                    "token": token
                }), 200
            else:
                return jsonify("Bad credentials"), 400

@api.route("/user", methods = ["GET"])
@jwt_required()
def get_all_user():
    users = User.query.all()
    return jsonify(list(map(lambda item: item.serialize(), users))), 200

@api.route("/me", methods = ["GET"])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)
    if not user:
        return jsonify("User not found"), 400
    
    return jsonify(user.serialize()), 200

@api.route("/reset-password", methods=["POST"])
def reset_password():
    # necesitamos el correo para evviar el link de recuperación
    
    email = request.json.get("email", None)
    user = User.query.filter_by(email=email).one_or_none()

    if user is None:
        return jsonify("user not found"), 404

    access_token = create_access_token(
        identity=email, expires_delta=expire_delta)

# https://studious-system-qp94qg9wwvp2xvpj-3000.app.github.dev/password-update?token=jdjdjdjdjdjdjdjdjd
    message = f"""
        <a href="{os.getenv("FRONTEND_URL")}/password-update?token={access_token}">recuperaar contraseña</a>
    """

    data = {
        "subject": "Recuperación de contraseña",
        "to": email,
        "message": message
    }

    sended_email = send_email(
        data.get("subject"), data.get("to"), data.get("message"))

    if sended_email:
        return jsonify("Message sended"), 200
    else:
        return jsonify("Error"), 200
    
@api.route("/update-password", methods=["PUT"])
@jwt_required()
def update_password():
    user_token_email = get_jwt_identity()
    password = request.json

    user = User.query.filter_by(email=user_token_email).first()

    if user is not None:
        salt = b64encode(os.urandom(32)).decode("utf-8")
        password = set_password(password, salt)

        user.salt = salt
        user.password = password

        try:
            db.session.commit()
            return jsonify("password changed successfuly"), 201
        except Exception as error:
            db.session.rollback()
            return jsonify("Error"), 500

    print(user.serialize)