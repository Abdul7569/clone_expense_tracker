from flask import Flask, request, jsonify
from sql_connection import get_sql_connection
import mysql.connector
import json
from flask_cors import CORS
# import expen
# ses
app = Flask(__name__)
CORS(app)
connection = get_sql_connection()
@app.route('/submit_user', methods=['POST'])
def submit_user():
    data = request.json
    name = data.get('name')
    mobile_number = data.get('mobile_number')

    # Insert user data into your database (create a user table if not already done)
    cursor = connection.cursor()
    query = "INSERT INTO users (name, mobile_number) VALUES (%s, %s)"
    cursor.execute(query, (name, mobile_number))
    connection.commit()
    cursor.close()

    return jsonify({"message": "User information saved successfully!"})

@app.route('/submit_expense', methods=['POST'])
def submit_expense():
    data = request.json
    description = data.get('description')
    amount = data.get('amount')
    category = data.get('category')

    # Insert expense data into the database
    cursor = connection.cursor()
    query = "INSERT INTO expense (description, amount, category) VALUES (%s, %s, %s)"
    cursor.execute(query, (description, amount, category))
    connection.commit()
    cursor.close()

    return jsonify({"message": "Expense added successfully!"})

@app.route('/save_total', methods=['POST'])
def save_total():
    data = request.json
    total = data.get('total')

    # Insert total expenses into the 'total' table in the database
    cursor = connection.cursor()
    query = "INSERT INTO save_total (total_amount) VALUES (%s)"
    cursor.execute(query, (total,))
    connection.commit()
    cursor.close()

    return jsonify({"message": "Total expenses saved successfully!"}), 200

@app.route('/save_income', methods=['POST'])
def save_income():
    data = request.json
    hourly_wage = data.get('hourly_wage')
    weekly_hours = data.get('weekly_hours')
    monthly_income = data.get('monthly_income')

    # Insert income data into your 'income' table
    cursor = connection.cursor()
    query = "INSERT INTO income (hourly_wage, weekly_hours, monthly_income) VALUES (%s, %s, %s)"
    cursor.execute(query, (hourly_wage, weekly_hours, monthly_income))
    connection.commit()
    cursor.close()

    return jsonify({"message": "Income information saved successfully!"}), 200
# @app.route('/add_debt', methods=['POST'])
# def add_debt():
#     data = request.json
#     description = data.get('description')
#     amount = data.get('amount')

#     # Insert debt data into your database (ensure the debt table exists)
#     cursor = connection.cursor()
#     query = "INSERT INTO debt (description, amount) VALUES (%s, %s)"
#     cursor.execute(query, (description, amount))
#     connection.commit()
#     cursor.close()

#     return jsonify({"message": "Debt information saved successfully!"})



if __name__ == '__main__':
    app.run(debug=True)
