from dotenv import load_dotenv
import os
from pymongo import MongoClient, errors
from flask_pymongo import PyMongo
from bson import ObjectId

client = MongoClient(os.getenv("DB_PATH"))
db = client.test
collection = db.users

#collection.insert_one({
#  "name": 'khalil',
#  "email": 'khalil@yahoo.com'
#  })

result = collection.delete_one({
  "_id": ObjectId("68eedc221316ef17462df20b")
})

if result.deleted_count > 0:
  print("deletou")
else:
  print("não deletou")


doc = collection.find_one({"_id": ObjectId("68eedc221316ef17462df20b")})

if doc:
    print("Documento encontrado:", doc)
else:
    print("Documento não encontrado")


