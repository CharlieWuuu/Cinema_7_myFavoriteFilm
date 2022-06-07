// 目的：渲染有加入最愛的資料
// 變數：取得本機儲存空間
const localData = JSON.parse(localStorage.getItem('片單'))
  ? JSON.parse(localStorage.getItem('片單'))
  : [];

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
      const xaxis = 3 + varDay8 * 12 + varCinema * 2;
      const current_testFilmHTML1 = current_testFilmHTML.replace(
        '{{xaxis}}',
        xaxis,
      );
      $('#film__container1').append(current_testFilmHTML1);
    } else {
      const varDay13 = favArrayI.d_num - 5;
      const xaxis = 3 + varDay13 * 12 + varCinema * 2;
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
  $('.nav>#13-17').click(function () {
    favTableSlideContainerHTML.style.transform = 'translateX(-35vw)';
  });

  $('.nav>#8-12').click(function () {
    favTableSlideContainerHTML.style.transform = 'translateX(35vw)';
  });
}

wrapper();

// 目的：刪除按到的片單
// 先選取片單

function remove(id) {
  console.log(id);
  id.remove(id);
}
