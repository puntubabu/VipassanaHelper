'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var moment = require('moment');
var AudioPlayer = require('react-native-audioplayer');

//Constants
var START_TEXT = 'Start';
var PAUSE_TEXT = 'Pause';
var RESET_TEXT = 'Reset';
var AUDIO_0 = 'a.mp3';
var AUDIO_1 = 'b.mp3';
var AUDIO_2 = 'c.mp3';
var PLAY_AUDIO_1 = 2700000;
var PLAY_AUDIO_2 = 3540000;
var PADDING = 2000;

var {
  AppRegistry,
  StyleSheet,
  ListView,
  Text,
  View,
  Image,
  TouchableHighlight,
} = React;

var VipassanaTimerApp = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function() {
    return {
      startTime: null,
      timeDiff: 0,
      startPauseText: "Start",
      hasStarted: false,
      isPaused: false,
      btnStyle: "btn",
      elapsedTime:0,
    };
  },

  componentDidMount: function() {},

  handleTick: function() {
    var that = this;
    var time = new Date().getTime();
    var timeDiff = time - (this.state.startTime - this.state.elapsedTime);
    this.setState({ timeDiff: timeDiff });

    //If anechya or bhavatu
    //todo: figure out a simpler way to play audio at correct times
    if (timeDiff >= PLAY_AUDIO_1 && timeDiff < (PLAY_AUDIO_1 + PADDING)) {
      AudioPlayer.play(AUDIO_1);
    } else if (timeDiff >= PLAY_AUDIO_2 && timeDiff < (PLAY_AUDIO_2 + PADDING)) {
      AudioPlayer.play(AUDIO_2);
      that.pause();
    }
  },

  start: function() {
    var that = this;

    if (this.state.hasStarted && this.state.isPaused) {
      AudioPlayer.play();
      this.setState({

        startTime: new Date().getTime(),
        startPauseText: PAUSE_TEXT,
        btnStyle: "btnPause",
        isPaused: false,

      });

    } else {

      //Start Intro Audio
      AudioPlayer.play(AUDIO_0);

      this.setState({ 
        startTime: new Date().getTime(),
        startPauseText: PAUSE_TEXT,
        hasStarted:true,
        btnStyle: "btnPause",
      });

    }

    this.intervalFunction = this.setInterval(
      () => {
        that.handleTick();
      }, 1000
    );

  },

  togglePause: function() {
    var elapsedTime = this.state.timeDiff;
    this.setState({
      startPauseText: START_TEXT,
      btnStyle: "btn",
      isPaused: true,
      elapsedTime: elapsedTime,
    });

    AudioPlayer.pause();
    clearInterval(this.intervalFunction);
  },

  reset: function() {
    this.setState({ 
      timeDiff: 0, 
      startPauseText: START_TEXT,
      hasStarted:false,
      isPaused: false,
      btnStyle: "btn",
      elapsedTime: 0,
    },
    function() {
      AudioPlayer.stop();
      clearInterval(this.intervalFunction);
    });
  },

  intervalFunction: function() {},

  toggleInterval: function() {
    clearInterval(this.intervalFunction);
  },

  render: function() {

    var elapsedTime = this.state.timeDiff ? moment.utc(this.state.timeDiff).format("HH:mm:ss").toString() : "00:00:00";
    var btnStyle = this.state.btnStyle;
    var startOrPause = (this.state.hasStarted && !this.state.isPaused) ? this.togglePause : this.start;

    return (
      <View style={styles.outerContainer}>
        <View style={styles.centerItem}>
          <Image style={styles.backgroundImage} source={require('./dharma_wheel.png')} />
        </View>
        <View style={styles.centerItem}>
          <Text style={styles.elapsedTime}>{elapsedTime}</Text>
        </View>
        <View style={styles.innerContainer}>
          <TouchableHighlight onPress={startOrPause} style={styles[btnStyle]}>
            <Text style={styles.startPauseText}>{this.state.startPauseText}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.reset} style={styles.btn}>
            <Text style={styles.startPauseText}>Reset</Text>
          </TouchableHighlight>
        </View>
      </View>


    );
  },

});

var styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#F2F2F2',
    marginTop: 25,
    flexDirection: 'column',
    flex:1,
  },
  innerContainer: {
    backgroundColor: '#F2F2F2',
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 40,
    marginRight: 40,
  },
  centerItem: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: '#00ff00',
    borderRadius: 3,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#000'
  },
  btnPause: {
    backgroundColor: '#F00',
    borderRadius: 3,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#000'    
  },
  backgroundImage: {
    height:180,
    width:180,
  },
  startPauseText: {
    fontSize: 28,
    alignItems: 'center',
  },
  elapsedTime: {
    fontSize: 42,
    marginTop: 50,
  },
});

AppRegistry.registerComponent('VipassanaTimerApp', () => VipassanaTimerApp);