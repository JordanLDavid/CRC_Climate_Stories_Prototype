from flask_admin.contrib.pymongo import ModelView
from .forms import PostForm

class PostView(ModelView):
  column_list = ('title', 'content', 'location', 'tags', 'created_at', 'status')
  column_sortable_list = ('title', 'created_at', 'status')
  form = PostForm

  def on_model_change(self, form, model, is_created):
    
      # Handle tags
      if 'tags' in model and isinstance(model['tags'], str):
          model['tags'] = [tag.strip() for tag in model['tags'].split(',')]
      
      # Create content dictionary
      model['content'] = {
          'description': form.content_description.data,
          'image': form.content_image.data if form.content_image.data else None
      }
      
      # Create location dictionary
      model['location'] = {
          'type': 'Point',
          'coordinates': [form.location_longitude.data, form.location_latitude.data]
      }
      
      # Remove temporary fields that shouldn't be stored in the database
      fields_to_remove = [
          'content_description', 'content_image',
          'location_latitude', 'location_longitude'
      ]
      for field in fields_to_remove:
          if field in model:
              del model[field]

  def on_form_prefill(self, form, id):
      model = self.get_one(id)
      
      # Handle tags
      if 'tags' in model and isinstance(model['tags'], list):
          form.tags.data = ', '.join(model['tags'])
      
      # Handle content
      if 'content' in model and isinstance(model['content'], dict):
          form.content_description.data = model['content'].get('description', '')
          form.content_image.data = model['content'].get('image', '')
      
      # Handle location
      if 'location' in model and isinstance(model['location'], dict):
          coordinates = model['location'].get('coordinates', [0, 0])
          form.location_longitude.data = coordinates[0]
          form.location_latitude.data = coordinates[1]
