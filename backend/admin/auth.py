from flask import session, redirect, url_for, request, render_template
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

def init_auth(app, user_collection):
    # User creation helper
    def create_user(username, password, role):
        hashed_password = generate_password_hash(password)
        user_collection.insert_one({'username': username, 'password': hashed_password, 'role': role})

    # User verification helper
    def verify_user(username, password):
        user = user_collection.find_one({'username': username})
        if user and check_password_hash(user['password'], password):
            return user
        return None

    # Login required decorator
    def login_required(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user' not in session:
                return redirect(url_for('login'))
            return f(*args, **kwargs)
        return decorated_function

    # Admin required decorator
    def admin_required(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user' not in session or session['user']['role'] != 'admin':
                return redirect(url_for('login'))
            return f(*args, **kwargs)
        return decorated_function

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            username = request.form['username']
            password = request.form['password']
            user = verify_user(username, password)
            if user:
                session['user'] = {'username': user['username'], 'role': user['role']}
                return redirect(url_for('admin.index'))
            return 'Invalid credentials'
        return render_template('login.html')

    @app.route('/logout')
    def logout():
        session.pop('user', None)
        return redirect(url_for('login'))

    # Return the functions that need to be used externally
    return {
        'login_required': login_required,
        'admin_required': admin_required,
        'create_user': create_user
    }
