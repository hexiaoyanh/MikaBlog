#coding:utf-8
from flask_pagedown.fields import PageDownField
from flask_wtf import Form, FlaskForm
from wtforms import StringField, SubmitField, TextAreaField
from wtforms.validators import DataRequired, Length, Email, Optional


class CommentForm(FlaskForm):
    name = StringField(u'昵称', validators=[DataRequired()])
    email = StringField(u'邮箱', validators=[DataRequired(), Length(1, 64),
                                            Email()])
    content = StringField(u'内容', validators=[DataRequired(), Length(1, 1024)])
    follow = StringField(validators=[DataRequired()])

    def validate(self):
        check_validate = super(CommentForm,self).validate()
        if not check_validate:
            return False
        return True
