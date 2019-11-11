$('#submit_btn').click(function () {
    let url = 'uploadview'
    let $input = $('#id_file');
    let progressBar = document.getElementById('progressBar');
    let progressBarRate = document.getElementById('percentAge');
    let files = $input[0].files
    let data = new FormData();
    data.append('video_file', files[0]);

    $.ajax({
        url: '',
        type: 'POST',
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        xhr: function () {
            var xhr = $.ajaxSettings.xhr();
            console.log(xhr);
            xhr.onloadstart = function (e) {
                alert('start upload');
            }

            xhr.onload = function (e) {
                alert('upload complate');
            }

            xhr.upload.addEventListener("progress", function (e) {
                if (e.lengthComputable) {
                    var percentComplete = Math.round(e.loaded / e.total * 100);
                    progressBar.value = e.loaded;
                    progressBar.max = e.total;
                    progressBarRate.innerHTML = '已上传 ' + percentComplete + ' %';
                }
            }, false);

            xhr.upload.onload = function(){
                $('#js-modal').css('display', 'block');
            };

            return xhr;
        }
    }).always(function(){
        alert('hello');
        $('#js-nextstep').removeAttr('disabled');

        $('#testa1').attr('href', 'http://meetfr.com');
        $('#testa2').attr('href', 'play.html');
        $('#testa3').click(function(){
            window.location = '/myadmin/video_publish/' + 3;
        });
    })
});