import mysql.connector
from mysql.connector import Error

__cnx = None

def get_sql_connection():
    global __cnx

    if __cnx is None:
        try:
            __cnx = mysql.connector.connect(
                user='root',  # Replace with correct username
                password='Afshiya@984836',  # Ensure the correct password
                database='expense_tracker'
            )
            if __cnx.is_connected():
                print("MySQL connection is successful.")
        except Error as e:
            print(f"Error while connecting to MySQL: {e}")
            __cnx = None
    return __cnx
