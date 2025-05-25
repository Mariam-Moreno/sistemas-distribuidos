import mysql.connector
from db_config import DB_CONFIG

def get_db_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except mysql.connector.Error as err:
        print(f"Error de conexión a la base de datos: {err}")
        return None

def fetch_all(query, params=None):
    conn = get_db_connection()
    if not conn:
        return []
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(query, params)
        results = cursor.fetchall()
        return results
    except mysql.connector.Error as err:
        print(f"Error en fetch_all: {err}")
        return []
    finally:
        cursor.close()
        conn.close()

def fetch_one(query, params=None):
    conn = get_db_connection()
    if not conn:
        return None
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(query, params)
        result = cursor.fetchone()
        return result
    except mysql.connector.Error as err:
        print(f"Error en fetch_one: {err}")
        return None
    finally:
        cursor.close()
        conn.close()

def execute_query(query, params=None):
    conn = get_db_connection()
    if not conn:
        return None, 0 # Devuelve None para el ID y 0 para filas afectadas
    cursor = conn.cursor()
    try:
        cursor.execute(query, params)
        conn.commit()
        return cursor.lastrowid, cursor.rowcount # lastrowid para INSERT, rowcount para UPDATE/DELETE
    except mysql.connector.Error as err:
        print(f"Error en execute_query: {err}")
        conn.rollback()
        return None, 0
    finally:
        cursor.close()
        conn.close()