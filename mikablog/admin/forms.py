# coding:utf-8
from flask_wtf import FlaskForm, Form
from flask_pagedown.fields import PageDownField
from wtforms import SelectField, StringField, TextAreaField, SubmitField, \
    PasswordField
from wtforms.validators import DataRequired, Length, Email, EqualTo

from mikablog.models import ArticleType
from ..main.forms import CommentForm


class CommonForm(FlaskForm):
    types = SelectField(u'博文分类', coerce=int, validators=[DataRequired()])



class SubmitArticlesForm(CommonForm):
    title = StringField(u'标题', validators=[DataRequired(), Length(1, 64)])
    content = PageDownField(u'博文内容', validators=[DataRequired()])
    summary = TextAreaField(u'博文摘要', validators=[DataRequired()])


class ManageArticlesForm(CommonForm):
    pass


class DeleteArticleForm(FlaskForm):
    articleId = StringField(validators=[DataRequired()])


class DeleteArticlesForm(FlaskForm):
    articleIds = StringField(validators=[DataRequired()])


class DeleteCommentsForm(FlaskForm):
    commentIds = StringField(validators=[DataRequired()])


class AdminCommentForm(CommentForm):
    article = StringField(validators=[DataRequired()])


class AddArticleTypeForm(FlaskForm):
    name = StringField(u'分类名称', validators=[DataRequired(), Length(1, 64)])
    introduction = TextAreaField(u'分类介绍')
    setting_hide = SelectField(u'属性', coerce=int, validators=[DataRequired()])
    menus = SelectField(u'所属导航', coerce=int, validators=[DataRequired()])
# You must add coerce=int, or the SelectFile validate function only validate the int data


class EditArticleTypeForm(AddArticleTypeForm):
    articleType_id = StringField(validators=[DataRequired()])


class AddArticleTypeNavForm(FlaskForm):
    name = StringField(u'导航名称', validators=[DataRequired(), Length(1, 64)])


class EditArticleNavTypeForm(AddArticleTypeNavForm):
    nav_id = StringField(validators=[DataRequired()])


class SortArticleNavTypeForm(AddArticleTypeNavForm):
    order = StringField(u'序号', validators=[DataRequired()])



class AddBlogPluginForm(FlaskForm):
    title = StringField(u'插件名称', validators=[DataRequired()])
    note = TextAreaField(u'备注')
    content = TextAreaField(u'内容', validators=[DataRequired()])


class ChangePasswordForm(FlaskForm):
    old_password = PasswordField(u'原来密码', validators=[DataRequired()])
    password = PasswordField(u'新密码', validators=[
        DataRequired(), EqualTo('password2', message=u'两次输入密码不一致！')])
    password2 = PasswordField(u'确认新密码', validators=[DataRequired()])


class EditUserInfoForm(FlaskForm):
    username = StringField(u'昵称', validators=[DataRequired()])
    email = StringField(u'电子邮件', validators=[DataRequired(), Length(1, 64), Email()])
    password = PasswordField(u'密码确认', validators=[DataRequired()])
