import requests
import datetime
from flask import Flask, jsonify, request, session, send_from_directory
from swagger import init_swagger
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from marshmallow import Schema, fields, ValidationError
from flask_cors import CORS
import os

from admin.auth import init_auth
from admin import init_admin

app = Flask(__name__, template_folder="templates", static_folder="static", static_url_path="")
CORS(app)
init_swagger(app)

# Check if running locally
if os.path.exists('.env'):
    from dotenv import load_dotenv
    load_dotenv()

# Your hCaptcha secret key (keep this secure and never expose it on the client side)
captcha_secret_key = os.getenv('CAPTCHA_SECRET_KEY')

# Now retrieve the MongoDB URI
mongo_uri = os.getenv('MONGODB_URI')
secret_key = os.getenv('SECRET_KEY')

# Configure MongoDB and Flask session
app.config["MONGO_URI"] = mongo_uri
app.config['SECRET_KEY'] = secret_key  # This is important for sessions
app.config['PERMANENT_SESSION_LIFETIME'] = datetime.timedelta(minutes=60)  # Optional: set session lifetime
mongo = PyMongo(app)
collection = mongo.db.stories
user_collection = mongo.db.users

# Initialize authentication and admin logic
auth = init_auth(app, user_collection)
init_admin(app, collection, auth['admin_required'])

# Serve the React app - this will serve the index.html for any path not caught by other routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Don't interfere with API routes - they should be handled by their respective handlers
    if path.startswith('api/'):
        # Let Flask continue to other routes
        return "Not found", 404
    # Serve static files if they exist
    elif os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    # For all other routes, serve the React app's index.html
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Use the login_required decorator where needed
@app.route('/protected')
@auth['login_required']
def protected_route():
    return 'This is a protected route.'

# Define the schema for input validation using Marshmallow
class PostSchema(Schema):
    title = fields.Str(required=True)
    content = fields.Dict(required=True)
    location = fields.Dict(required=True)
    tags = fields.List(fields.Str(), required=True)
    created_at = fields.DateTime()
    status = fields.Str(required=False, default='pending')
    captchaToken = fields.Str(required=True)

# Define a schema for tag validation
class TagSchema(Schema):
    tags = fields.List(fields.Str(), required=False, allow_none=True)

# Initialize the schema instance
post_schema = PostSchema()
tag_schema = TagSchema()
# Swagger definition for Post
# Swagger definition for Post

# CREATE (Insert a new document)
# Route to create a new post document
@app.route('/posts/create', methods=['POST'])
def create():
    """
    Create a new post
    ---
    parameters:
      - name: post
        in: body
        required: true
        schema:
          $ref: '#/definitions/Post'
    responses:
      201:
        description: Post created
      400:
        description: Validation error
    """
    try:
        # Validate and deserialize the request JSON
        data = post_schema.load(request.json)
        data = request.json
        hcaptcha_response = data.get('captchaToken')

        if not hcaptcha_response:
            return jsonify({'success': False, 'message': 'CAPTCHA token missing'}), 400

        # Verify the hCaptcha token with the hCaptcha verification endpoint
        verification_response = requests.post(
            'https://hcaptcha.com/siteverify',
            data={
                'secret': captcha_secret_key,
                'response': hcaptcha_response
            }
        )

        verification_result = verification_response.json()

        if not verification_result.get('success'):
            return jsonify({'success': False, 'message': 'CAPTCHA verification failed'}), 400

        data['created_at'] = datetime.datetime.now(datetime.timezone.utc)  # Add created_at timestamp
        data['status'] = 'pending'  # Set initial status to pending

        # Insert the sanitized data into the collection
        result = collection.insert_one(data)
        
        return jsonify({'message': 'Post created', 'post_id': str(result.inserted_id)}), 201
    
    except ValidationError as err:
        # Return error messages in case of validation failure
        return jsonify({'errors': err.messages}), 400

# Example route to retrieve all posts
@app.route('/posts', methods=['GET'])
def get_posts():
    """
    Get all posts with optional tag filters
    ---
    parameters:
      - name: tags
        in: query
        type: array
        items:
          type: string
        collectionFormat: multi  # This allows multiple tags
        required: false
        description: Optional list of tags to filter posts
    responses:
      200:
        description: A list of posts
      400:
        description: input validation error
    """
    #documents = list(collection.find())
    #for document in documents:
        #document['_id'] = str(document['_id'])  # Convert ObjectId to string
    try:
        # Validate query parameters for tags
        raw_tags = request.args.getlist('tags')  # This returns a list directly
        
        # Validate and load the tags
        args = tag_schema.load({'tags': raw_tags})  # Pass as a dictionary
        tags = args.get('tags', [])

        query = {'status': 'approved'}  # Only return approved posts by default
        if tags:
            # Use $all to match all specified tags
            query['tags'] = {'$all': tags}
        
        posts = list(collection.find(query, {'_id': 0}))
        return jsonify(posts), 200

    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

# UPDATE (Modify a document by ID)
@app.route('/posts/update/<id>', methods=['PUT'])
def update_post(id):
    """
    Update a post by ID
    ---
    parameters:
      - name: id
        in: path
        required: true
        type: string
        description: The ID of the post to update
      - name: post
        in: body
        required: true
        schema:
          $ref: '#/definitions/Post'
    responses:
      200:
        description: Post updated
      400:
        description: Invalid post ID or validation error
      404:
        description: Post not found
    """
    try:
        # Validate the post_id to ensure it's a valid ObjectId
        if not ObjectId.is_valid(id):
            return jsonify({'error': 'Invalid post ID'}), 400
        
        hcaptcha_response = data.get('captchaToken')

        if not hcaptcha_response:
            return jsonify({'success': False, 'message': 'CAPTCHA token missing'}), 400

        # Verify the hCaptcha token with the hCaptcha verification endpoint
        verification_response = requests.post(
            'https://hcaptcha.com/siteverify',
            data={
                'secret': captcha_secret_key,
                'response': hcaptcha_response
            }
        )

        # Validate and deserialize the request JSON
        data = post_schema.load(request.json)
        data['updated_at'] = datetime.datetime.now(datetime.timezone.utc)  # Add updated_at timestamp

        # Find the post and update it
        result = collection.update_one(
            {'_id': ObjectId(id)},
            {'$set': data}
        )

        if result.matched_count == 0:
            return jsonify({'message': 'Post not found'}), 404

        return jsonify({'message': 'Post updated'}), 200
    
    except ValidationError as err:
        # Return error messages in case of validation failure
        return jsonify({'errors': err.messages}), 400

# DELETE (Delete a document by ID)
@app.route('/posts/delete/<id>', methods=['DELETE'])
def delete_post(id):
    """
    Delete a post by ID
    ---
    parameters:
      - name: id
        in: path
        required: true
        type: string
        description: The ID of the post to delete
    responses:
      200:
        description: Post deleted
      400:
        description: Invalid post ID
      404:
        description: Post not found
    """
    try:
        # Validate the post_id to ensure it's a valid ObjectId
        if not ObjectId.is_valid(id):
            return jsonify({'error': 'Invalid post ID'}), 400

        # Find the post and delete it
        result = collection.delete_one({'_id': ObjectId(id)})

        if result.deleted_count == 0:
            return jsonify({'message': 'Post not found'}), 404

        return jsonify({'message': 'Post deleted'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
