from flask_admin import Admin
from .views import PostView

def init_admin(app, collection):
    admin = Admin(app, name='Post Moderation', template_mode='bootstrap3')
    admin.add_view(PostView(collection, 'Posts'))
    return admin