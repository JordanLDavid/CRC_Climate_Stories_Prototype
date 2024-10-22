import datetime
from flask import Flask, jsonify, request
from swagger import init_swagger
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from marshmallow import Schema, fields, ValidationError
from flask_cors import CORS
import pdb
import os
from flask_admin import Admin
from flask_admin.contrib.pymongo import ModelView
from wtforms import form, fields as wtforms_fields, validators


app = Flask(__name__)
CORS(app)
init_swagger(app)

# Check if running locally
if os.path.exists('.env'):
    from dotenv import load_dotenv
    load_dotenv()  # Load environment variables from .env file

# Now retrieve the MongoDB URI
mongo_uri = os.getenv('MONGODB_URI')
secret_key = os.getenv('SECRET_KEY')

# Configure MongoDB
app.config["MONGO_URI"] = mongo_uri  # Change this to your MongoDB URI
app.config['SECRET_KEY'] = secret_key 
mongo = PyMongo(app)
collection = mongo.db.stories

# Initialize Flask-Admin
admin = Admin(app, name='Post Moderation', template_mode='bootstrap3')

class PostForm(form.Form):
  title = wtforms_fields.StringField('Title')
  description = wtforms_fields.TextAreaField('Description')  # For content['description']
  image = wtforms_fields.StringField('Image URL', [validators.Optional()])  # Optional for content['image']
  latitude = wtforms_fields.FloatField('Latitude')  # For location['coordinates'][1]
  longitude = wtforms_fields.FloatField('Longitude')  # For location['coordinates'][0]
  tags = wtforms_fields.StringField('Tags')
  status = wtforms_fields.SelectField('Status', choices=[
      ('pending', 'Pending'),
      ('approved', 'Approved'),
      ('rejected', 'Rejected')
  ])

class PostView(ModelView):
  column_list = ('title', 'content', 'location', 'tags', 'created_at', 'status')
  column_sortable_list = ('title', 'created_at', 'status')
  #column_filters = ('title', 'tags', 'status')
  form = PostForm

  def on_model_change(self, form, model, is_created):
      model['updated_at'] = datetime.datetime.now(datetime.timezone.utc)
      if 'tags' in model and isinstance(model['tags'], str):
          model['tags'] = [tag.strip() for tag in model['tags'].split(',')]
      # Handling 'description' and optional 'image' (string to dictionary)
      if 'description' in model and isinstance(model['description'], str):
          model['content'] = {'description': model['description']}
          if 'image' in form and form.image.data:  # Only include image if provided
              model['content']['image'] = form.image.data
      if 'latitude' in model and 'longitude' in model:
          model['location'] = {
              'type': 'Point',
              'coordinates': [form.longitude.data, form.latitude.data]
          }

  def on_form_prefill(self, form, id):
      model = self.get_one(id)
      if 'tags' in model and isinstance(model['tags'], list):
          form.tags.data = ', '.join(model['tags'])
      if 'content' in model and isinstance(model['content'], dict):
          form.description.data = model['content'].get('description', '')
          form.image.data = model['content'].get('image', '')
      if 'location' in model and isinstance(model['location'], dict):
          coordinates = model['location'].get('coordinates', [0, 0])
          form.longitude.data = coordinates[0]  # Longitude
          form.latitude.data = coordinates[1]  # Latitude

# Add view to Flask-Admin
admin.add_view(PostView(collection, 'Posts'))

# Define the schema for input validation using Marshmallow
class PostSchema(Schema):
    title = fields.Str(required=True)
    content = fields.Dict(required=True)
    location = fields.Dict(required=True)
    tags = fields.List(fields.Str(), required=True)
    created_at = fields.DateTime()
    status = fields.Str(required=False, default='pending')

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
