/**
 * Created by army8735 on 2017/8/25.
 */

import './single.html';
import './index.less';

import TopNav from './TopNav.jsx';
import BotNav from './BotNav.jsx';

import Loading from './loading/Loading.jsx';
import Index from './index/Index.jsx';
import Geography from './geography/Geography.jsx';
import History from './history/History.jsx';
import Legend from './legend/Legend.jsx';
import Character from './character/Character.jsx';
import About from './history/About.jsx';

let $page = $('#page');
migi.eventBus.on('changeBgi', function(name) {
  $page[0].className = 'page';
  $page.addClass(name);
});

let last;

let topNav = migi.render(
  <TopNav/>,
  document.body
);

let loading = migi.render(
  <Loading/>,
  '#page'
);

let index;
let geography;
let history;
let legend;
let character;
let about;

let botNav = migi.render(
  <BotNav/>,
  document.body
);

botNav.on('change', function(type) {
  if(last) {
    last.hide();
  }

  switch (type) {
    case 'index':
      if(!index) {
        index = migi.render(
          <Index/>,
          '#page'
        );
      }
      last = index;
      migi.eventBus.emit('changeBgi', 'index');
      break;
    case 'geography':
      if(!geography) {
        geography = migi.render(
          <Geography/>,
          '#page'
        );
      }
      last = geography;
      migi.eventBus.emit('changeBgi', 'geography');
      break;
    case 'history':
      if(!history) {
        history = migi.render(
          <History/>,
          '#page'
        );
      }
      last = history;
      migi.eventBus.emit('changeBgi', 'history');
      break;
    case 'legend':
      if(!legend) {
        legend = migi.render(
          <Legend/>,
          '#page'
        );
        legend.on('choose', function(name) {
          botNav.clear();
          if(last) {
            last.hide();
          }
          if(!character) {
            character = migi.render(
              <Character/>,
              '#page'
            );
          }
          character.user(name);
          last = character;
        });
      }
      last = legend;
      migi.eventBus.emit('changeBgi', 'legend');
      break;
    case 'about':
      if(!about) {
        about = migi.render(
          <About/>,
          '#page'
        );
        about.on('jiemeng', function() {
          botNav.clear();
          if(last) {
            last.hide();
          }
          if(!character) {
            character = migi.render(
              <Character/>,
              '#page'
            );
          }
          character.user('jiemeng');
          last = character;
        });
      }
      last = about;
      migi.eventBus.emit('changeBgi', 'history');
      break;
  }
  if(last) {
    last.show();
  }
});

loading.on('fin', function() {
  loading.clean();
  botNav.emit('change', 'index');
  topNav.show();
  botNav.show();
});
// loading.emit('fin');
// botNav.emit('change', 'index');
// topNav.show();
// botNav.show();
// loading.clean();
// if(!character) {
//   character = migi.render(
//     <Character/>,
//     '#page'
//   );
// }
// character.user('hetu');