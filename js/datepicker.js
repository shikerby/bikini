// 在日期对象上添加格式化输出日期的方法
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};


// 日期选择的原生实现
((window) => {

    // 定义日期选择器对象 datepicker
    let datepicker = {};
    let oInput;

    // 定义月份数据，此数据会在已经渲染的日期选择器被update
    let data, datepickerBox;
    let today = new Date();

    // 在datepicker对象上 定义日期选择器的方法，
    // 1. 获取当前月份日期的各种数据
    datepicker.getDateData = (year, month) => {

        // 如果未提供年月，默认是以今天的日期，提供year, month的初始化
        year = year || today.getFullYear();
        month = month || today.getMonth() + 1;
        // 在获得确定的年月时，获取当前月的第一天和最后一天
        let startday = new Date(year, month - 1, 1);
        // 获取当前月的最后一天
        let weekday = startday.getDay();
        // 由于我们的将星期日放在了一个星期的最后一天，所以需要做以下判断 当weekday是 0 时，转换成7
        let endday = new Date(year, month, 0);

        let dateofendday = endday.getDate();
        // 获取当前月的前一个月在本月页面需要渲染的日期数量，等于 weekday - 1;
        let lastdayofprevmonth = new Date(year, month - 1, 0);
        // 当前月的上个月的最后一天的日期
        let dateoflastdayofprevmonth = lastdayofprevmonth.getDate();
        // 定义当前月的第一天是星期几
        weekday = weekday ? weekday : 7;
        // 获取当前月最后一天的具体日期
        let countofprevmonth = weekday - 1;

        // 这个是用在保存页面42个日期对象数据的数组
        let ret = [];

        // 在datepicker中，当前月将会生成 7 * 6 = 42 小的日期 dom，利用for循环生成填充这些dom的数据
        for (let i = 0; i < 42; i++) {
            // diff 这个数据是为了方便我们计算 上个月的日期，当前月日期，和下个月日期的 利用循环索引和需要渲染的上个月日期数生成
            let diff = i + 1 - countofprevmonth;
            let showDate = diff;
            let monthofshowDate = month;

            if (diff <= 0) {
                showDate = diff + dateoflastdayofprevmonth;
                monthofshowDate = month - 1;
            }
            if (diff > dateofendday) {
                showDate = diff - dateofendday;
                monthofshowDate = month + 1;
            }

            if (monthofshowDate === 0) monthofshowDate = 12;
            if (monthofshowDate === 13) monthofshowDate = 1;

            ret.push({
                diff: diff,
                showDate: showDate,
                monthofshowDate: monthofshowDate,
            });
        }

        data = {
            year: year,
            month: month,
            days: ret,
        }
        
        return data;
    };

    // 2. 利用 getDateDate 获取的数据 填充创建的dom元素
    datepicker.createDateDom = () => {

        let html = '<div class="datepicker-header">' +
            '<a class="datepicker-btn datepicker-btn-prev">&lt;</a>' +
            '<span class="datepicker-cur-month">' + data.year + '年' + data.month + '月' + '</span>' +
            '<a class="datepicker-btn datepicker-btn-next">&gt;</a>' +
            '</div>' +
            '<div class="datepicker-body">' +
            '<table>' +
            '<thead>' +
            '<tr>' +
            '<th>一</th>' +
            '<th>二</th>' +
            '<th>三</th>' +
            '<th>四</th>' +
            '<th>五</th>' +
            '<th>六</th>' +
            '<th>日</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';

        for (let i = 0, len = data.days.length; i < len; i++) {
            let date = data.days[i];
            if (i % 7 === 0) {
                html += '<tr>';
            }
            html += '<td data-date=' + date.showDate + '>' + date.showDate + '</td>';
            if (i % 7 === 6) {
                html += '</tr>';
            }
        }

        html += '</tbody>' +
            '</table>' +
            '<div class="timepicker">' +
            '<div class="timepicker-hours">' +
            '<div class="item-h" data-hour="00">00</div>' +
            '<div class="item-h" data-hour="01">01</div>' +
            '<div class="item-h" data-hour="02">02</div>' +
            '<div class="item-h" data-hour="03">03</div>' +
            '<div class="item-h" data-hour="04">04</div>' +
            '<div class="item-h" data-hour="05">05</div>' +
            '<div class="item-h" data-hour="06">06</div>' +
            '<div class="item-h" data-hour="07">07</div>' +
            '<div class="item-h" data-hour="08">08</div>' +
            '<div class="item-h" data-hour="09">09</div>' +
            '<div class="item-h" data-hour="10">10</div>' +
            '<div class="item-h" data-hour="11">11</div>' +
            '<div class="item-h" data-hour="12">12</div>' +
            '<div class="item-h" data-hour="13">13</div>' +
            '<div class="item-h" data-hour="14">14</div>' +
            '<div class="item-h" data-hour="15">15</div>' +
            '<div class="item-h" data-hour="16">16</div>' +
            '<div class="item-h" data-hour="17">17</div>' +
            '<div class="item-h" data-hour="18">18</div>' +
            '<div class="item-h" data-hour="19">19</div>' +
            '<div class="item-h" data-hour="20">20</div>' +
            '<div class="item-h" data-hour="21">21</div>' +
            '<div class="item-h" data-hour="22">22</div>' +
            '<div class="item-h" data-hour="23">23</div>' +
            '</div>' +
            '<div class="timepicker-minutes">' +
            '<div class="item-m" data-minute="00">整点</div>' +
            '<div class="item-m" data-minute="30">半点</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="datepicker-footer">' +
            '<a class="button is-primary" id="set-pub-time">设置时间</a>' +
            '<a class="button is-info" id="clear-data">清空</a>' +
            '<a class="button is-link" id="reset-today">今天</a>' +
            '<a class="button is-danger" id="submit-pub-time">确认发布</a>' +
            '</div>';

        return html;
    };

    datepicker.update = (direction) => {
        if (direction == 'prev') {
            data.month--;
            if (data.month === 0) {
                data.month = 12;
                data.year -= 1;
            }
            datepicker.getDateData(data.year, data.month)
        }
        if (direction == 'next') {
            data.month++;
            if (data.month > 12) {
                data.month -= 12;
                data.year += 1;
            }
            datepicker.getDateData(data.year, data.month)
        }

        if (direction == 'today') {
            data.year = today.getFullYear();
            data.month = today.getMonth() + 1;
            datepicker.getDateData(data.year, data.month)
        }
    };

    // 3. render渲染日期选择器外包装，和内部dom
    datepicker.render = () => {
        let html = datepicker.createDateDom();
        datepickerBox = document.querySelector('.datepicker-wrap');
        if (!datepickerBox) {
            datepickerBox = document.createElement('div');
            datepickerBox.className = 'datepicker-wrap';
            document.body.appendChild(datepickerBox);
        }
        datepickerBox.innerHTML = html;

        datepicker.bindEvent();
    };

    // 4. 绑定事件
    datepicker.bindEvent = () => {
        let setPubTime = document.querySelector('#set-pub-time');
        let resetToday = document.querySelector('#reset-today');
        let clearPubTime = document.querySelector('#clear-data');
        let submitPubTime = document.querySelector('#submit-pub-time');
        let datepickerBodytable = document.querySelector('.datepicker-body table');
        let timepicker = document.querySelector('.timepicker');

        setPubTime.addEventListener('click', () => {
            datepickerBodytable.style.display = 'none';
            timepicker.style.display = 'flex';
        });

        resetToday.addEventListener('click', () => {
            datepicker.update('today');
            datepicker.render();
        });

        clearPubTime.addEventListener('click', () => {
            oInput.value = '';
            datepicker.update('today');
            datepicker.render();
        });

        submitPubTime.addEventListener('click', () => {
            if (oInput.value.indexOf(":") === -1) {
                alert('请务必设置发布时间');
            } else {
                datepickerBox.classList.remove('datepicker-wrap-show');
                isOpen = false;
            }
        });
    };

    // 5. 初始化日期选择器
    datepicker.init = (config) => {

        let isOpen = false;
        let date = new Date();

        oInput = document.querySelector(config.input);

        datepicker.getDateData(config.year, config.month);
        datepicker.render();

        // 给日期旭日input添加事件
        oInput.addEventListener('click', (e) => {
            if (isOpen) {
                datepickerBox.classList.remove('datepicker-wrap-show');
                isOpen = false;
            } else if (!isOpen) {
                isOpen = true;
                let top = utils.offset(oInput, 'top');
                let left = utils.offset(oInput, 'left');
                let height = oInput.offsetHeight;
                let width = oInput.offsetWidth;

                datepickerBox.classList.add('datepicker-wrap-show');
                datepickerBox.style.left = left + width / 2 - 350 + 'px';
                datepickerBox.style.top = top + height + 5 + 'px';
            }
        });


        // 在日期选择器包装元素上添加事件，利用事件对象 event.target 捕获子元素，
        datepickerBox.addEventListener('click', (e) => {
            let target = e.target;

            if (target.classList.contains('datepicker-btn-prev')) {
                datepicker.update('prev');
                datepicker.render();
            }

            if (target.classList.contains('datepicker-btn-next')) {
                datepicker.update('next');
                datepicker.render();
            }

            if (target.tagName.toLowerCase() == 'td') {
                date = new Date(data.year, data.month - 1, target.dataset.date, 7);
                oInput.value = date.format('yyyy-MM-dd');
            }

            if (target.classList.contains('item-h')) {
                if (oInput.value.indexOf("-") === -1) {
                    datepicker.update('today');
                    datepicker.render();
                } else {
                    let temp = oInput.value.split(' ')[0]
                    oInput.value = '';
                    oInput.value += temp + " " + target.dataset.hour + ":00";
                }
            }

            if (target.classList.contains('item-m')) {
                let strArr = oInput.value.split(":");
                if (oInput.value.indexOf(" ") === -1) {
                    alert("请先设置小时，然后再选择整点或半点");
                } else if (1) {
                    strArr[1] = target.dataset.minute;
                    oInput.value = strArr.join(":");
                }
            }

        });

    };


    // 挂载这个日期选择器对象到全局对象 window 上
    window.datepicker = datepicker;

})(window);