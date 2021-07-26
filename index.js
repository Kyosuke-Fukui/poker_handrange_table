const OppRange = class {
    constructor() {
        this.array = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
        this.makeTable();
        this.changeColor();
        this.presetRange = [];
        this.openRaise();
        this.color();
    }

    makeTable = () => {
        $('#oppRange').html('')
        for (let i = 0; i < 13; i++) {
            $('#oppRange').append(`<tr id="r${i}"></tr>`)
            for (let j = 0; j < 13; j++) {
                if (i < j) {
                    $(`#r${i}`).append(`<td>${this.array[i]}${this.array[j]}s</td>`)
                } else if (i > j) {
                    $(`#r${i}`).append(`<td>${this.array[j]}${this.array[i]}o</td>`)
                } else {
                    $(`#r${i}`).append(`<td>${this.array[j]}${this.array[i]}</td>`)
                }
            }
        }
    }
    //マウスドラッグで色を塗る
    changeColor = () => {
        let is_drag = false;
        //マウスダウン時フラグオン
        $('#oppRange').on('mousedown', function () {
            is_drag = true;
        })
        //マウスアップ時とマウスが範囲外に行ったときフラグオフ
        $('#oppRange').on('mouseup mouseleave', function () {
            is_drag = false;
        })

        $('#oppRange').on('mousemove', function () {
            if (is_drag === true) {
                //ドラッグ時ホバー発火
                $("#oppRange td").hover(function () {
                    $(this).css("background-color", "#FFFF99");
                });
            } else {
                //フラグオフ時ホバー解除
                $('#oppRange td').off('mouseenter mouseleave');
            }
        });
        //クリックで色解除
        $("#oppRange td").on('click', function () {
            $(this).css("background-color", "");
        });

    }

    openRaise = () => {
        let radio = $('input[name="position"]:checked').val()
        if (radio === 'EP') {
            this.presetRange = ['ATo+', 'KJo+', '55+', 'A2s+', 'K8s+', 'Q9s+', 'J9s+', 'T9s+', '98s', '87s', '76s', '65s']
        }
        if (radio === 'HJ') {
            this.presetRange = ['ATo+', 'KJo+', 'QJo+', '33+', 'A2s+', 'K7s+', 'Q9s+', 'J9s+', 'T8s+', '98s', '87s', '76s', '65s', '54s', '43s']
        }
        if (radio === 'CO') {
            this.presetRange = ['A7o+', 'KTo+', 'QTo+', 'JTo+', '22+', 'A2s+', 'K3s+', 'Q6s+', 'J7s+', 'T7s+', '97s+', '86s+', '76s', '65s', '54s', '43s']
        }
        if (radio === 'BTN') {
            this.presetRange = ['A2o+', 'K8o+', 'Q9o+', 'J8o+', 'T8o+', '98o', '22+', 'A2s+', 'K2s+', 'Q2s+', 'J4s+', 'T6s+', '96s+', '85s+', '75s+', '63s+', '53s+', '43s']
        }
        $('#custom').val(this.presetRange.join(','))
    }

    //ポジションによるハンドレンジを色塗り
    color = () => {
        this.handRange = $('#custom').val().split(',')
        let target = []
        this.handRange.forEach(element => {
            //A2o+, KTs+などの場合
            if (element.length == 4 & element.substr(3) == '+') {
                switch (element.substr(2, 1)) {
                    case 'o':
                        for (let i = this.array.findIndex((e) => e == element.substr(1, 1)); i > this.array.findIndex((e) => e == element.substr(0, 1)); i--) {
                            target.push(`${element.substr(0, 1)}${this.array[i]}o`)
                        }
                        break;

                    case 's':
                        for (let i = this.array.findIndex((e) => e == element.substr(1, 1)); i > this.array.findIndex((e) => e == element.substr(0, 1)); i--) {
                            target.push(`${element.substr(0, 1)}${this.array[i]}s`)
                        }
                        break;
                }
            } else if (element.length == 3) {
                //33+などの場合
                if (element.substr(2) == '+') {
                    for (let i = this.array.findIndex((e) => e == element.substr(0, 1)); i >= 0; i--) {
                        target.push(`${this.array[i]}${this.array[i]}`)
                    }
                } else {
                    //KQsなどの場合    
                    target.push(element)
                }
            } else if (element.length == 2) {
                //TTなどの場合    
                target.push(element)
            }
        });

        //一旦全てのtdのカラーをリセット
        $('#oppRange td').each((a, b) => {
            $(b).css("background-color", "");
        });

        //ハンドレンジに含まれるtdのみ色塗り
        $('#oppRange td').each((a, b) => {
            if (target.includes($(b).text())) {
                $(b).css("background-color", "#FFFF99");
            }
        });
    }
}

const or = new OppRange
$("button").on('click', or.color)
$('input[name="position"]:radio').change(() => {
    or.openRaise()
    or.color()
})
