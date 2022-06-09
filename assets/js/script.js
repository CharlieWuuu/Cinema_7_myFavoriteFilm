// 目的：渲染有加入最愛的資料
// 變數：取得本機儲存空間
// const localData = JSON.parse(localStorage.getItem('片單'))
//   ? JSON.parse(localStorage.getItem('片單'))
//   : [];

// 函式：載入時，顯示已選片單數量
function showFilmAmount() {
  document.getElementById('film_amount').innerText = localData.length;
}
showFilmAmount();

// 變數：最終渲染用的陣列資料
const favArrayData = [];

// 函式：取得最愛的資料
function getFavFilmData() {
  // 迴圈：逐一取出full_id準備檢查
  for (i = 0; i < localData.length; i++) {
    // 迴圈：進入片單原始資料逐一檢查
    for (x = 0; x < filmData.list.length; x++) {
      // 判斷：若片單原始資料包full_id，將此筆原始片單資料放入陣列favArrayData中
      if (filmData.list[x].full_id == localData[i].full_id) {
        favArrayData.splice(0, 0, filmData.list[x]);
      }
    }
  }
}

getFavFilmData();

// 目的：顯示最愛片單
const testFilmHTML = `
<div class="film" id="{{full_id}}"
style="transform: translate({{xaxis}}vw, {{yaxis}}vh); height: {{height}}vh">
	<span class="film__time">{{startTime}}-{{endTime}}</span>
	<p class="film__name">{{name}}</p>
	<span>{{cinema}}</span>
	<span onclick="remove(this.parentNode)">x</span>
</div>
`;

// 函式：為了顯示所有的片單，因此設定迴圈次數[i] = 片單數量
function renderFilm() {
  // 判斷：8-12還是13-17
  for (var i = 0; i < favArrayData.length; i++) {
    const favArrayI = favArrayData[i];
    const varCinema = favArrayI.c_num;
    const varLeft = favArrayI.left;
    const varLong = favArrayI.long;
    const yaxis = -168 + varLeft * 0.2;
    const height = varLong * 0.2;
    const current_testFilmHTML = testFilmHTML
      .replace('{{full_id}}', favArrayI.full_id)
      .replace('{{yaxis}}', yaxis)
      .replace('{{height}}', height)
      .replace('{{startTime}}', favArrayI.startTime)
      .replace('{{endTime}}', favArrayI.endTime)
      .replace('{{name}}', favArrayI.name)
      .replace('{{cinema}}', favArrayI.cinema);
    if (favArrayI.d_num < 5) {
      const varDay8 = favArrayI.d_num;
      const xaxis = 6.5 + varDay8 * 16 + varCinema * 3;
      const current_testFilmHTML1 = current_testFilmHTML.replace(
        '{{xaxis}}',
        xaxis,
      );
      $('#film__container1').append(current_testFilmHTML1);
    } else {
      const varDay13 = favArrayI.d_num - 5;
      const xaxis = 6.5 + varDay13 * 16 + varCinema * 3;
      const current_testFilmHTML2 = current_testFilmHTML.replace(
        '{{xaxis}}',
        xaxis,
      );
      $('#film__container2').append(current_testFilmHTML2);
    }
  }
}

renderFilm();

// 目的：切換時間表
// 變數：滑動時間表的HTML
const favTableSlideContainerHTML = document.querySelector(
  '.favTableSlide__container',
);

// 函式：隱藏除 id=introduction 以外的區塊
function wrapper() {
  $('.favorite__select>#13-17').click(function () {
    favTableSlideContainerHTML.style.transform = 'translateX(-45vw)';
    document.querySelector('#favoriteSelectText').innerText = '4/13～17';
  });

  $('.favorite__select>#8-12').click(function () {
    favTableSlideContainerHTML.style.transform = 'translateX(45vw)';
    document.querySelector('#favoriteSelectText').innerText = '4/08～12';
  });
}

wrapper();

// const currentFData = favArrayData;
// 刪除按到的片單
function remove(selectedFilm) {
  selectedFilm.remove(selectedFilm);
  // 刪除localStorage
  for (i = 0; i < localData.length; i++) {
    if (selectedFilm.id == localData[i].full_id) {
      current_i = i;
      localData.splice(current_i, 1);
      localStorage.setItem('片單', JSON.stringify(localData));
    }
  }
  // 刪除favArrayData

  for (x = 0; x < favArrayData.length; x++) {
    if (selectedFilm.id == favArrayData[x].full_id) {
      current_x = x;
      favArrayData.splice(current_x, 1);
    }
  }
  showFilmAmount();
  conflict();
}

// 衝堂功能
function conflict() {
  let check = '';
  // 依序取出各天資料;
  dateData = [
    'D17',
    'D16',
    'D15',
    'D14',
    'D13',
    'D12',
    'D11',
    'D10',
    'D09',
    'D08',
  ];

  for (d = 0; d < dateData.length; d++) {
    const todayData = dateData[d];
    for (x = 0; x < favArrayData.length; x++) {
      // 選出要進行比對的資料;
      const favArrayX = favArrayData[x];
      if (favArrayX.did !== todayData) {
        // 不是這天的資料;
      } else if (favArrayX.did == todayData) {
        const x1 = parseFloat(favArrayX.left);
        const x2 = parseFloat(favArrayX.left) + parseFloat(favArrayX.long);
        for (y = 0; y < favArrayData.length; y++) {
          // 比較當天所有的資料;
          const favArrayY = favArrayData[y];
          if (favArrayY.did !== todayData) {
            // 不是這天的資料;
          } else if (favArrayX.full_id == favArrayY.full_id) {
            // favArrayX.name + '與' + favArrayY.name + '不衝突';
            check = 0;
          } else if (favArrayY.did == todayData) {
            y1 = parseFloat(favArrayY.left);
            y2 = parseFloat(favArrayY.left) + parseFloat(favArrayY.long);
            // 如果X的範圍比Y都小或大，代表不衝突；除此之外的狀況顯示為衝堂
            if ((x1 <= y1 && x2 <= y1) || (x1 >= y2 && x2 >= y2)) {
              // favArrayX.name + '與' + favArrayY.name + '不衝突';
              check = 0;
            } else {
              // favArrayX.name + '與' + favArrayY.name + '衝突';
              check = 1;
              break;
            }
          }
        }
        const conflictFilm = document.querySelector('#' + favArrayX.full_id);
        if (check == 1) {
          conflictFilm.style.color = '#EA5136';
        } else if (check == 0) {
          conflictFilm.style.color = 'black';
        }
      }
    }
  }
}

conflict();
