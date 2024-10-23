from flask_admin.contrib.pymongo import ModelView
from flask_admin.model.template import macro
from markupsafe import Markup
from .forms import PostForm
from flask import session, redirect, url_for

class PostView(ModelView):
    def is_accessible(self):
        return 'user' in session and session['user'].get('role') == 'admin'

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('login'))

    # List of columns to display
    column_list = ('title', 'content_image_display', 'content_description', 'location', 'tags', 'created_at', 'status')
    
    # Rename columns for display
    column_labels = {
        'content_image_display': 'Image',
        'content_description': 'Description'
    }
    
    # Sortable columns
    column_sortable_list = ('title', 'created_at', 'status')
    
    # Use our custom form
    form = PostForm
    
    # Format the image display using a formatter function
    def _image_formatter(view, context, model, name):
        if model.get('content', {}).get('image'):
            return Markup(
                f'<img src="{model["content"]["image"]}" style="max-width: 100px; max-height: 100px;">'
            )
        return ''

    # Format the description display
    def _description_formatter(view, context, model, name):
        return model.get('content', {}).get('description', '')

    column_formatters = {
        'content_image_display': _image_formatter,
        'content_description': _description_formatter
    }

    def __init__(self, collection, name=None, category=None, endpoint=None, url=None, static_folder=None):
        super(PostView, self).__init__(collection, name, category, endpoint, url, static_folder)

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
        
        # Remove temporary fields
        fields_to_remove = [
            'content_description', 'content_image',
            'location_latitude', 'location_longitude'
        ]
        for field in fields_to_remove:
            if field in model:
                del model[field]

    def on_form_prefill(self, form, id):
        model = self.get_one(id)
        
        if 'tags' in model and isinstance(model['tags'], list):
            form.tags.data = ', '.join(model['tags'])
        
        if 'content' in model and isinstance(model['content'], dict):
            form.content_description.data = model['content'].get('description', '')
            form.content_image.data = model['content'].get('image', '')
        
        if 'location' in model and isinstance(model['location'], dict):
            coordinates = model['location'].get('coordinates', [0, 0])
            form.location_longitude.data = coordinates[0]
            form.location_latitude.data = coordinates[1]