__author__ = 'mitrikyle'
from flask import Flask
from flask import request
from flask import render_template
from flask import  redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/newtest.db'
db = SQLAlchemy(app)

class Dream(db.Model):
    content = db.Column(db.Text(), primary_key=True)
    date = db.Column(db.DateTime())

    def __init__(self, content):
        self.content = content
        self.date = datetime.utcnow()

    def __unicode__(self):
        return self.content


@app.route('/', methods=['GET', 'POST'])
def index():
    dream_list = Dream.query.all()
    if request.method == 'POST':
        dream_content = request.form['dream']
        print request.form['dream']
        db.session.add(Dream(dream_content))
        db.session.commit()
        return redirect('/')
    return render_template('index.html', dream_list = dream_list)


if __name__ == '__main__':
    app.run(debug=True)
