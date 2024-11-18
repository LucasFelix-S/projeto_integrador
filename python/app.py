from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import psycopg2
import os

app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/*": {"origins": "*"}} )
bcrypt = Bcrypt(app)

conn = psycopg2.connect(
    host="db-postgresql-nyc3-60782-do-user-18341592-0.i.db.ondigitalocean.com",
    database="defaultdb",
    user="doadmin",
    password="AVNS_W1gF6BStA8ae6nqqLed",
    port=25060,
    sslmode="require"
)
cursor = conn.cursor()

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        nome = data.get('nome')
        email = data.get('email')
        senha = data.get('senha')

        # Hash da senha usando bcrypt
        hashed_password = bcrypt.generate_password_hash(senha).decode('utf-8')

        # Insere no banco
        cursor.execute(
            "INSERT INTO Cliente (nome, email, senha) VALUES (%s, %s, %s)",
            (nome, email, hashed_password)
        )
        conn.commit()
        return jsonify({"message": "Usuário registrado com sucesso!"}), 201
    except Exception as e:
        print("Erro no registro:", e)
        return jsonify({"error": "Erro ao registrar o usuário."}), 500


@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        senha_digitada = data.get('senha')

        # Busca o usuário no banco
        cursor.execute("SELECT * FROM Cliente WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "E-mail ou senha inválidos."}), 401

        user_id, user_name, user_email, user_password = user

        # Verifica a senha usando bcrypt
        if not bcrypt.check_password_hash(user_password, senha_digitada):
            return jsonify({"error": "E-mail ou senha inválidos."}), 401

        return jsonify({"message": "Login bem-sucedido!"}), 200
    except Exception as e:
        print("Erro no login:", e)
        return jsonify({"error": "Erro ao processar o login."}), 500
    
@app.route('/api/test', methods=['GET'])
def test_endpoint():
    return jsonify({"message": "API está funcionando corretamente!"}), 200

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=5000)