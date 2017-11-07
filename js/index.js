/*
	dog_walk
	dog_jump
	duck_fly
	duck_fly_left
	duck_fly_right
	duck_fly_top_right
	duck_fly_top_left
*/

// Для генерации утки на уровне травы по всей длинне окна
var grassY = window.innerHeight - parseInt($('.foot').css('height'));
var grassWidth = window.innerWidth;
// Случайная скорость полета
var [minFlyTime, maxFlyTime] = [1400, 2000];
// Сколько слоев по высоте пролетит
var flyY_steps = 10;

// Случайный числа в диапазоне [min, max]
function get_rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// Выбор направления анимации
function get_anim_direction(bezierParam) {
    if (bezierParam.start.x >= bezierParam.end.x) {
        if (bezierParam.start.y < bezierParam.end.y) {
            return 'duck gs duck_fly_top_left';
        }
        return 'duck gs duck_fly_left';

    } else {
        if (bezierParam.start.y < bezierParam.end.y) {
            return 'duck gs duck_fly_top_right';

        }
        return 'duck gs duck_fly_right';
    }
}

// Получение кривых полета
function gen_bezierParamsNew() {
    var bezierPaths = {
        0: {
            start: {
                x: get_rand(0, grassWidth),
                y: grassY,
                angle: -get_rand(0, 45),
                length: Math.random()
            },
            end: {
                x: get_rand(0, grassWidth),
                y: grassY - grassY / flyY_steps,
                angle: get_rand(0, 45),
                length: Math.random() * get_rand(1, 3)
            }

        }
    };
    for (i = 1; i < flyY_steps; i++) {
        bezierPaths[i] = {
            start: {
                x: bezierPaths[i - 1].end.x,
                y: bezierPaths[i - 1].end.y,
                angle: -get_rand(0, 45),
                length: Math.random()
            },
            end: {
                x: get_rand(0, grassWidth),
                y: bezierPaths[i - 1].end.y - grassY / flyY_steps,
                angle: get_rand(0, 45),
                length: Math.random() * get_rand(1, 3)
            }
        }
    }
    // Особого смысла в foot в расчете ент, просто чтобы были отриц коорд
    bezierPaths[Object.keys(bezierPaths).length - 1].end.y = -parseInt($('.foot').css('height'));
    return bezierPaths;
}

// Анимация полета
function fly(duck) {
    var time = 0;
    var b = gen_bezierParamsNew();

    function anim(bezier) {
        var flyTime_ = get_rand(minFlyTime, maxFlyTime);
        setTimeout(function() {
            duck.attr('class', get_anim_direction(bezier));
        }, time);
        duck.animate({
                path: new $.path.bezier(bezier)
            },
            flyTime_
        );
        time += flyTime_;
    }

    for (var b_id in b) {
        anim(b[b_id]);
    }
    setTimeout(function() {
        console.log(duck);
        alert('You lose. Refresh page to start again!');
    }, time);
}

$('#duck').click(function() {
    $('#wr #duck').remove();
    alert("You won! Refresh page to start again!");
});


$('#dog').attr('class', 'dog gs dog_walk');
$('#dog').animate({
        'left': window.innerWidth / 2 + 'px'
    },
    get_rand(2000, 4000),
    function() {
        $('#dog').attr('class', 'dog gs dog_jump');
        setTimeout(function() {
            fly($('#duck'));
        }, get_rand(3000, 4500));
    });