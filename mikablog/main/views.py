# coding:utf-8
from flask import render_template, request, current_app, redirect, \
    url_for, flash
from . import main
from ..models import Article, ArticleType, article_types, Comment, \
     User,  BlogView, Menu
from .forms import CommentForm
from .. import db

@main.route('/')
def index():
    BlogView.add_view(db)
    #按时间获取所有文章
    pagination = Article.query.order_by(Article.create_time.desc()).all()
    return render_template('index.html',pagination=pagination,title='首页')


@main.route('/article-types/<int:id>/')
def articleTypes(id):
    BlogView.add_view(db)
    pagination = Article.query.filter_by(articleType_id=id+1).order_by(Article.create_time.desc()).all()
    menu = Menu.query.order_by(Menu.order.asc()).all()
    return render_template('index.html',pagination=pagination,title=menu[id-1].name)


@main.route('/article-detials/<int:id>', methods=['GET', 'POST'])
def articleDetails(id):
    BlogView.add_view(db)
    form = CommentForm(follow=-1)
    #得到文章内容
    article = Article.query.get_or_404(id)

    #form表单
    if form.validate_on_submit():
        if form.name.data=='Mika' and form.email.data != 'heiaoyang@foxmail.com':
            flash("您不能使用这个名字",category='success')
            return render_template('article_detials.html', Comment=Comment, article=article,
                                   title=article.title,
                                   form=form, id=article.id)
        comment = Comment(article=article,
                          content=form.content.data,
                          author_name=form.name.data,
                          author_email=form.email.data)

        if form.follow.data != '-1':
            comment.reply_to=form.follow.data
        comment.comment_type='reply'
        db.session.add(comment)
        db.session.commit()
        # if followed_id != -1:
        #     followed = Comment.query.get_or_404(followed_id)
        #     f = Follow(follower=comment, followed=followed)
        #     comment.comment_type = 'reply'
        #     comment.reply_to = followed.author_name
        #     db.session.add(f)
        #     db.session.add(comment)
        #     db.session.commit()
        flash(u'提交评论成功！', 'success')
        return redirect(url_for('.articleDetails', id=article.id))
    if form.errors:
        flash(u'发表评论失败', 'danger')

    pagination = article.comments.order_by(Comment.timestamp.asc()).filter_by(comment_type='comment').all()
    article.add_view(article, db)
    return render_template('article_detials.html', Comment=Comment,article=article,
                            pagination=pagination,title=article.title,
                           form=form, id=article.id)
    # page=page, this is used to return the current page args to the
    # disable comment or enable comment endpoint to pass it to the articleDetails endpoint
