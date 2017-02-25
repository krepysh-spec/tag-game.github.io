(function ($) {

    'use strict';

    var Game = {

        init: function () {
            this.settings();
            this.menu();
            this.create();
            this.menuPause();

            this.audio.play();
            window.addEventListener('keydown', this.keyboardEvent, false);
        },

        audio: new Audio('resources/Whisper.mp3'),

        cache: {
            timer:           $('#timer'),
            settingsBtn:     $('#settings > ul > li').find('a'),

            menuPage:        $('.menu'),
            gamePage:        $('.game'),
            recordsPage:     $('.records'),
            howToPlayPage:   $('.how-to-play'),

            newGame:         $('.newGame-btn'),
            records:         $('.records-btn'),
            howToPlay:       $('.how-to-play-btn'),

            board:           $('#board'),
            pauseBlock:      $('.pause-block'),
            playPauseBtn:    $('.play-pause-btn')
        },

        settings: function () {

            var that = this;

            this.checkSettings();

            this.cache.settingsBtn.on('click', function (e) {
                e.preventDefault();

                switch ($(this).attr('data-btn')) {

                        case 'menu-bnt':
                            that.cache.timer.timer('pause');

                            swal({
                                    title: "Внимание!",
                                    text: "Вы уверены что хотите завершить игровой процесс?",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#DD6B55",
                                    confirmButtonText: "Да, выйти в меню",
                                    cancelButtonText: "Продолжить игру",

                                },
                                function(isConfirm){
                                    if (isConfirm) {
                                        that.pager('.game', '.menu');
                                        that.checkSettings();
                                        that.cache.timer.timer('remove');
                                        that.cache.timer.fadeOut(300);
                                    } else {
                                        that.cache.timer.timer('resume');
                                    }
                                });


                            break;

                        case 'volume-btn':
                            if ($(this).attr('data-play') == true) {
                                that.audio.pause();
                                $(this).attr('data-play', '0');
                                $(this).html('<i class="fa fa-volume-off" aria-hidden="true"></i>');
                            } else {
                                that.audio.play();
                                $(this).attr('data-play', '1');
                                $(this).html('<i class="fa fa-volume-up" aria-hidden="true"></i>');
                            }
                            break;

                        case 'pause-btn':
                            if ($(this).attr('data-pause') == false) {
                                $(this).attr('data-pause', '1');
                                $(this).html('<i class="fa fa-play" aria-hidden="true"></i>');
                                that.cache.pauseBlock.fadeIn(700);
                                that.cache.timer.timer('pause');
                            } else {
                                $(this).attr('data-pause', '0');
                                $(this).html('<i class="fa fa-pause" aria-hidden="true"></i>');
                                that.cache.pauseBlock.fadeOut(700);
                                that.cache.timer.timer('resume');
                            }
                            break;

                        default:
                            throw new Error('data-btn Not Found');
                }

            });
        },

        checkSettings: function () {
            if (this.cache.menuPage.hasClass('active')) {
                for (var i = 0; i < this.cache.settingsBtn.length; i++) {
                    if($(this.cache.settingsBtn[i]).attr('data-btn') == 'menu-bnt' ||
                        $(this.cache.settingsBtn[i]).attr('data-btn') == 'pause-btn') {
                        $(this.cache.settingsBtn[i]).parent().css('display', 'none');
                    }
                }
            } else {
                for (var a = 0; a < this.cache.settingsBtn.length; a++) {
                    $(this.cache.settingsBtn[a]).parent().css('display', 'block');
                }
            }
        },

        menu: function () {

            var that = this;

            this.cache.newGame.on('click', function (e) {
               e.preventDefault();
               that.newGame();
               that.pager('.menu', '.game');
               that.checkSettings();
               that.timer();
            });


            this.cache.howToPlay.on('click', function (e) {
                e.preventDefault();
                that.pager('.menu', '.how-to-play');
                that.checkSettings();
            })
        },
        
        menuPause: function () {
            var that = this;

            this.cache.playPauseBtn.on('click', function (e) {
                e.preventDefault();
                that.cache.pauseBlock.fadeOut(700);
                that.cache.timer.timer('resume');

                $.each(that.cache.settingsBtn, function (key, val) {
                    if($(val).attr('data-pause')) {
                        $(val).attr('data-pause', '0');
                        $(val).html('<i class="fa fa-pause" aria-hidden="true"></i>');
                    }
                });
            })
        },

        pager: function (close, open) {
            $(close).removeClass('active');
            $(open).addClass('active');
        },
        
        timer: function () {
            this.cache.timer.fadeIn(300);
            
            this.cache.timer.timer({
                format: '%M:%S'
            });
        },

        getXY: function (i) { return 'x' + ( ( ( i - 1 ) % 4 ) + 1 ) + 'y' + Math.ceil( (i)/4); },

        create: function () {
            for(var i = 1; i <= 15; i++) {
                this.cache.board.append('<div class="block block-' + i + ' ' + this.getXY(i) + '">' + i + '</div>');
            }
        },

        keyboardEvent: function (e) {
            
            switch(e.keyCode) {
                case 38: key('up');
                    break;
                case 40: key('down');
                    break;
                case 37: key('left');
                    break;
                case 39: key('right');
                    break;
            }

            function key(type) {
                for(var a = 1; a <= 4; a++)
                    for(var b = 1; b <= 3; b++) {
                        switch( type ) {
                            case 'up':
                                var from = 'x'+a+'y'+(b+1);
                                var to   = 'x'+a+'y'+b;
                                break;
                            case 'down':
                                var from = 'x'+a+'y'+(4-b);
                                var to   = 'x'+a+'y'+(5-b);
                                break;
                            case 'left':
                                var from = 'x'+(b+1)+'y'+a;
                                var to   = 'x'+b+'y'+a;
                                break;
                            case 'right':
                                var from = 'x'+(4-b)+'y'+a;
                                var to   = 'x'+(5-b)+'y'+a;
                                break;
                        }
                        if( !$('.'+to).length ) {$('.'+from).removeClass(from).addClass(to);return}
                    }
            }

            this.checkWin();
        },

        key: function (type) {

            for(var a = 1; a <= 4; a++)
                for(var b = 1; b <= 3; b++) {
                    switch( type ) {
                        case 'up':
                            var from = 'x'+a+'y'+(b+1);
                            var to   = 'x'+a+'y'+b;
                            break;
                        case 'down':
                            var from = 'x'+a+'y'+(4-b);
                            var to   = 'x'+a+'y'+(5-b);
                            break;
                        case 'left':
                            var from = 'x'+(b+1)+'y'+a;
                            var to   = 'x'+b+'y'+a;
                            break;
                        case 'right':
                            var from = 'x'+(4-b)+'y'+a;
                            var to   = 'x'+(5-b)+'y'+a;
                            break;
                    }
                    if( !$('.'+to).length ) {$('.'+from).removeClass(from).addClass(to);return}
                }
        },

        getRandomInt: function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },

        newGame: function () {
            for(var a=1; a <= 1000; a++) {
                switch( this.getRandomInt(1 , 4) ) {
                    case 1: this.key('up');    break;
                    case 2: this.key('down');  break;
                    case 3: this.key('left');  break;
                    case 4: this.key('right'); break;
                }
            }
        },

        checkWin: function () {
            var counter = 0,
                i = 1;

            for(i; i <= 15; i++) {
                if( $('.block-'+i).hasClass( this.getXY(i) ) ) counter++;
            }

            if(counter == 15) alert('Поздравляем! Вы победили!');
        }

    };

    Game.init();

}(jQuery));