'use strict';

(function exerciseTimer() {
  var timer = {};

  timer.defaultValues = {
    DEFAULT_WORK_PERIOD: 30,
    DEFAULT_REST_PERIOD: 10,
    DEFAULT_NUMBER_OF_SETS: 3,
    DEFAULT_COUNTDOWN_SECONDS: 5,
    DEFAULT_BGCOLOR: 'white',
    DEFAULT_TEXT_COLOR: 'hsla(0,0%,0%,0.8)',
    DEFAULT_WORK_BGCOLOR: 'white',
    DEFAULT_REST_BGCOLOR: '#2CD48A',
    DEFAULT_LAST_BGCOLOR: '#C23035',
    DEFAULT_FINISHED_BGCOLOR: 'white',
    // DEFAULT_FINISHED_BGCOLOR: '#4373AD',
    DEFAULT_FADE_TIME: 500,
  };

  timer.interval = null;
  timer.workPeriod = timer.defaultValues.DEFAULT_WORK_PERIOD;
  timer.restPeriod = timer.defaultValues.DEFAULT_REST_PERIOD;
  timer.numberOfSets = timer.defaultValues.DEFAULT_NUMBER_OF_SETS;
  timer.queue = [];
  timer.queuePosition = 0;
  timer.countdownSeconds = timer.defaultValues.DEFAULT_COUNTDOWN_SECONDS;
  timer.sounds = {};
  timer.sounds.beep = new Audio('beep.wav');
  timer.sounds.work = new Audio('work.wav');
  timer.sounds.rest = new Audio('rest.wav');
  timer.sounds.countdown = new Audio('countdown.wav');
  timer.sounds.win = new Audio('applause.m4a');
  timer.sounds.second = new Audio('tr66_rim.wav');

  function leadingZero(time) {
    return time < 10 ? '0' + time : +time;
  }

  function formatAsTime(seconds) {
    //find out how many hours/mins/seconds are left
    var hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    // don't show hours/minutes if we don't need them
    if (hours > 0)
      var timeStr =
        leadingZero(hours) +
        ':' +
        leadingZero(minutes) +
        ':' +
        leadingZero(seconds);
    else if (minutes > 0)
      var timeStr = leadingZero(minutes) + ':' + leadingZero(seconds);
    else var timeStr = seconds;

    return timeStr;
  }

  function parseInput(input) {
    var re = /^(\d+)[\/\\\-\.\,](\d+)[\/\\\-\.\,](\d+)$/;
    if (re.test(input)) {
      var match = re.exec(input);
      timer.workPeriod = +match[1];
      timer.restPeriod = +match[2];
      timer.numberOfSets = +match[3];
      return true;
    } else {
      return false;
    }
  }

  function initQueue() {
    timer.queue = [timer.countdownSeconds];
    for (var i = 0; i < timer.numberOfSets; i++) {
      timer.queue.push(timer.workPeriod);
      timer.queue.push(timer.restPeriod);
    }
    timer.queue.pop(); // don't need the last rest period
    timer.queuePosition = 0;
    return;
  }

  function updateTimeDisplay(time) {
    $('#time-display').text(time);
  }

  function updateSetDisplay(n) {
    if (+n === n) {
      $('#set-display').text('Set ' + n + ' of ' + timer.numberOfSets);
    } else {
      $('#set-display').text(n);
    }
  }

  function defaultColors() {
    document.body.style.background = timer.defaultValues.DEFAULT_BGCOLOR;
    document.body.style.color = timer.defaultValues.DEFAULT_TEXT_COLOR;
  }

  function restColors() {
    document.body.style.background = timer.defaultValues.DEFAULT_REST_BGCOLOR;
    document.body.style.color = timer.defaultValues.DEFAULT_TEXT_COLOR;
  }

  function workColors() {
    document.body.style.background = timer.defaultValues.DEFAULT_WORK_BGCOLOR;
    document.body.style.color = timer.defaultValues.DEFAULT_TEXT_COLOR;
  }

  function finishedColors() {
    document.body.style.background =
      timer.defaultValues.DEFAULT_FINISHED_BGCOLOR;
    document.body.style.color = timer.defaultValues.DEFAULT_TEXT_COLOR;
  }

  function showEscapeInstructions() {
    $('#escape-instructions').fadeIn(timer.defaultValues.DEFAULT_FADE_TIME);
  }

  function finishExercise() {
    timer.sounds.win.play();
    updateTimeDisplay(':)');
    updateSetDisplay(':)');
    finishedColors();
    console.log('Finished!');
  }

  function lastSet() {
    updateSetDisplay('LAST SET!');
    document.body.style.background = timer.defaultValues.DEFAULT_LAST_BGCOLOR;
    document.body.style.color = 'white';
  }

  function startTimer(totalSeconds) {
    clearInterval(timer.interval);

    // set start to current time as Unix timestamp
    var start = new Date().getTime();
    var end = start + totalSeconds * 1000;

    updateTimeDisplay(formatAsTime(totalSeconds));

    //every second, do this:
    timer.interval = setInterval(function intervalHandler() {
      var now = $.now();
      var millisecondsLeft = end - now;

      // when timer has run out of seconds on current run
      if (millisecondsLeft <= 0) {
        clearInterval(timer.interval);

        // if we haven't reached the end of the queue yet
        if (timer.queuePosition < timer.queue.length - 1) {
          timer.queuePosition++;
          startTimer(timer.queue[timer.queuePosition]);

          // start the first set
          if (timer.queuePosition === 0) {
            timer.sounds.work.play();

            // start a new set
          } else if (timer.queuePosition % 2 !== 0) {
            timer.sounds.work.play();
            var msg = 'Work';
            workColors();
            if (timer.queuePosition === timer.queue.length - 1) {
              lastSet();
            } else {
              updateSetDisplay((timer.queuePosition - 1) / 2 + 1);
            }

            // start a rest period
          } else {
            timer.sounds.rest.play();
            var msg = 'Rest';
            restColors();
            updateSetDisplay('Rest');
          }

          console.log(msg + ' - queue position is now ' + timer.queuePosition);
        } else {
          // Winner winner chicken dinner
          finishExercise();
        }
        return;
      }

      var secondsLeft = Math.round(millisecondsLeft / 1000);

      updateTimeDisplay(formatAsTime(secondsLeft));

      if (secondsLeft <= 3 && secondsLeft > 0) {
        timer.sounds.countdown.play();
      } else if (secondsLeft >= 4 && timer.queuePosition % 2 !== 0) {
        timer.sounds.second.play();
      }
    }, 1000);
  }

  function initAll() {
    clearInterval(timer.interval);

    timer.workPeriod = timer.defaultValues.DEFAULT_WORK_PERIOD;
    timer.restPeriod = timer.defaultValues.DEFAULT_REST_PERIOD;
    timer.numberOfSets = timer.defaultValues.DEFAULT_NUMBER_OF_SETS;
    timer.queue = [];
    timer.queuePosition = 0;
    timer.countdownSeconds = timer.defaultValues.DEFAULT_COUNTDOWN_SECONDS;

    updateTimeDisplay('');
    updateSetDisplay('');
    defaultColors();
    $('#escape-instructions').fadeOut('');
    $('#input-field').val('');
    $(' #instructions-container ').fadeIn(
      timer.defaultValues.DEFAULT_FADE_TIME
    );
    $(' #input-container ').fadeIn(
      timer.defaultValues.DEFAULT_FADE_TIME,
      function() {
        $('#input-field').focus();
      }
    );
  }

  $('#go-button').click(function() {
    // shake input field if input is wrong format
    if (!parseInput($('#input-field').val())) {
      $(' #input-container ').effect('shake', function() {
        $(' #input-field ').val('');
        $(' #input-field ').focus();
      });
      return false;
    }

    initQueue();

    $(' #instructions-container ').fadeOut(
      timer.defaultValues.DEFAULT_FADE_TIME
    );
    $(' #input-container ').fadeOut(
      timer.defaultValues.DEFAULT_FADE_TIME,
      function() {
        updateSetDisplay('Get ready...');
        startTimer(timer.queue[timer.queuePosition]);
        // timer.sounds.countdown.play();
        showEscapeInstructions();
      }
    );

    console.log('Starting timer with ' + timer.queue);
    console.log('Work - queue position is now ' + timer.queuePosition);
  });

  $('#input-field').keydown(function(e) {
    if (e.keyCode === 13) {
      $('#go-button').click();
    }
  });

  $(document).keydown(function(e) {
    if (e.keyCode === 27) {
      // 27 = escape key
      initAll();
    }
  });
})();
