from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import psycopg2
import hashlib

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

conn = psycopg2.connect(
    host="localhost",
    database="projeto_integrador",
    user="postgres",
    password="!#Y1e3xbf4"
)
cursor = conn.cursor()

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        nome = data.get('nome')
        email = data.get('email')
        senha = data.get('senha')

        hashed_password = bcrypt.generate_password_hash(senha).decode('utf-8')

        cursor.execute(
            "INSERT INTO Cliente (nome, email, senha) VALUES (%s, %s, %s)",
            (nome, email, hashed_password)
        )
        conn.commit()
        return jsonify({"message": "Usuário registrado com sucesso!"}), 201
    except Exception as e:
        print("Erro no cadastro:", e)
        return jsonify({"error": "Erro ao registrar o usuário."}), 500

    
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        senha_digitada = data.get('senha')

        cursor.execute("SELECT * FROM Cliente WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "E-mail ou senha inválidos."}), 401

        user_id, user_name, user_email, user_password = user

        if not bcrypt.check_password_hash(user_password, senha_digitada):
            return jsonify({"error": "E-mail ou senha inválidos."}), 401

        return jsonify({"message": "Login bem-sucedido!"}), 200
    except Exception as e:
        print("Erro no login:", e)
        return jsonify({"error": "Erro ao processar o login."}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)