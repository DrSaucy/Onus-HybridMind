import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL")

def setup_database():
    try:
        conn = psycopg2.connect(SUPABASE_DB_URL)
        cur = conn.cursor()

        cur.execute("""
            CREATE TABLE IF NOT EXISTS q1_procurement (
                id SERIAL PRIMARY KEY,
                vendor_name TEXT,
                item_description TEXT,
                unit_price NUMERIC,
                quantity INT,
                total_paid NUMERIC,
                date DATE
            )
        """)

        cur.execute("TRUNCATE TABLE q1_procurement;")

        mock_data = [
            ("Global Supplies Inc", "Office Chairs", 150.00, 50, 7500.00, '2026-01-15'),
            ("TechCorp", "Server Racks", 1200.00, 5, 6000.00, '2026-02-10'),
            ("Apex Chemicals", "Industrial Adhesive", 100.00, 12000, 1200000.00, '2026-03-05'),
            ("Office Basics", "Printer Paper", 5.00, 500, 2500.00, '2026-03-12')
        ]

        insert_query = """
            INSERT INTO q1_procurement (vendor_name, item_description, unit_price, quantity, total_paid, date)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cur.executemany(insert_query, mock_data)
        
        conn.commit()
        cur.close()
        conn.close()
        print("PostgreSQL setup complete!")

    except Exception as e:
        print(f"Database error: {e}")

if __name__ == "__main__":
    setup_database()
