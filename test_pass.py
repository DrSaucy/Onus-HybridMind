import psycopg2
import urllib.parse
user='postgres.hxddkdeiabapiaxmnwsp'
host='aws-1-ap-southeast-1.pooler.supabase.com'
port=6543
dbname='postgres'
passwords=['Putmysauce@86', 'Putmysauce%4086', 'Putmysauce4086', urllib.parse.unquote('Putmysauce%4086')]
success=False
for p in passwords:
    try:
        conn=psycopg2.connect(host=host, port=port, user=user, password=p, dbname=dbname, connect_timeout=5)
        print('SUCCESS WITH:', p)
        success=True
        break
    except Exception as e:
        print('FAIL:', p)
        print(e)
if not success:
    print('ALL FAILED')
