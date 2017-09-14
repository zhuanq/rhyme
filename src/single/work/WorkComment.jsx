/**
 * Created by army8735 on 2017/9/1.
 */

import Comment from '../character/Comment.jsx';

let init;
let Skip = -1;
let Take = 10;
let SortType = 0;
let MyComment = 0;
let CurrentCount = 0;
let ajax;
let loadingMore;
let loadEnd;
let $window = $(window);
let $page = $('#page');
let $main;
let $body = $(document.body);

class WorkComment extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      $main = $('.main.work');
      $window.on('scroll', function() {
        self.checkMore();
      });
      $page.on('scroll', function() {
        self.checkMore();
      });
    });
  }
  show() {
    let self = this;
    $(self.element).removeClass('fn-hide');
    self.showComment = true;
  }
  hide() {
    let self = this;
    $(self.element).addClass('fn-hide');
    self.showComment = false;
    Skip = -1;
  }
  @bind showComment
  @bind rootId = null
  @bind replayId = null
  @bind replayName
  @bind hasContent
  @bind loading
  @bind id
  load() {
    let self = this;
    // self.ref.comment.showComment();
    self.ref.comment.message = '读取中...';
    if(ajax) {
      ajax.abort();
    }
    self.loading = true;
    ajax = util.postJSON('works/GetToWorkMessage_List', { WorkID: self.id , Skip, Take, SortType, MyComment, CurrentCount }, function(res) {
      if(res.success) {
        let data = res.data;
        CurrentCount = data.Size;
        Skip += Take;
        if(data.data.length) {
          self.ref.comment.message = '';
          self.ref.comment.showComment(res.data.data);
        }
        else {
          self.ref.comment.showComment(res.data.data);
          self.ref.comment.message = '暂无评论';
          loadEnd = true;
        }
      }
      else {
        self.ref.comment.showComment();
        self.ref.comment.message = res.message || util.ERROR_MESSAGE;
      }
      self.loading = false;
    }, function(res) {
      self.ref.comment.showComment();
      self.ref.comment.message = res.message || util.ERROR_MESSAGE;
      self.loading = false;
    });
  }
  checkMore() {
    let self = this;
    let WIN_HEIGHT = $window.height();
    let bool;
    if(window.IS_MOBILE) {
      bool = $page.scrollTop() + WIN_HEIGHT + 30 > $main.outerHeight();
    }
    else {
      bool = $window.scrollTop() + WIN_HEIGHT + 30 > $page.height();
    }
    if(self.showComment && !self.loading && !loadingMore && !loadEnd && bool) {
      loadingMore = true;
      ajax = util.postJSON('works/GetToWorkMessage_List', { WorkID: self.id , Skip, Take, SortType, MyComment, CurrentCount }, function(res) {
        if(res.success) {
          let data = res.data;
          CurrentCount = data.Size;
          Skip += Take;
          if(data.data.length) {
            self.ref.comment.addMore(data.data);
            if(data.data.length < Take) {
              self.ref.comment.message = '';
              loadEnd = true;
            }
          }
          else {
            loadEnd = true;
            self.ref.comment.message = '';
          }
        }
        else {
          self.ref.comment.message = res.message || util.ERROR_MESSAGE;
        }
        self.loading = false;
      }, function(res) {
        self.ref.comment.message = res.message || util.ERROR_MESSAGE;
        self.loading = false;
      });
    }
  }
  switchType(e, vd) {
    let $ul = $(vd.element);
    $ul.toggleClass('alt');
    $ul.find('li').toggleClass('cur');
    let rel = $ul.find('.cur').attr('rel');
    CurrentCount = 0;
    SortType = rel;
    Skip = 0;
    this.ref.comment.showComment();
    this.ref.comment.abort();
    this.load();
  }
  switchType2(e, vd) {
    let $ul = $(vd.element);
    $ul.toggleClass('alt');
    $ul.find('li').toggleClass('cur');
    let rel = $ul.find('.cur').attr('rel');
    CurrentCount = 0;
    MyComment = rel;
    Skip = 0;
    this.ref.comment.showComment();
    this.ref.comment.abort();
    this.load();
  }
  render() {
    return <div class="comments fn-hide">
      <ul class="type2 fn-clear" onClick={ { li: this.switchType2 } }>
        <li class="cur" rel="0"><span>全部</span></li>
        <li rel="1"><span>我的</span></li>
      </ul>
      <ul class="type fn-clear" onClick={ { li: this.switchType } }>
        <li class="cur" rel="0"><span>最新</span></li>
        <li rel="1"><span>最热</span></li>
      </ul>
      <Comment ref="comment" zanUrl="works/AddWorkCommentLike" subUrl="works/GetTocomment_T_List" delUrl="works/DeleteCommentByID"/>
    </div>;
  }
}

export default WorkComment;
