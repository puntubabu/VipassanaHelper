'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import AudioPlayer from 'react-native-audioplayer';
import moment from 'moment';

let START_TEXT = 'Start';
let PAUSE_TEXT = 'Pause';
let RESET_TEXT = 'Reset';
let AUDIO_0 = 'a.mp3';
let AUDIO_1 = 'b.mp3';
let AUDIO_2 = 'c.mp3';
// let PLAY_AUDIO_1 = 2700000;
// let PLAY_AUDIO_2 = 3540000;
let PLAY_AUDIO_1 = 270000;
let PLAY_AUDIO_2 = 554000;
let PADDING = 2000;


class VipassanaTimer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      startTime: null,
      timeDiff: 0,
      startPauseText: "Start",
      hasStarted: false,
      isPaused: false,
      btnStyle: "btn",
      elapsedTime:0,
      queue: ['AUDIO_1', 'AUDIO_2']
    }
  }

  render() {
    var elapsedTime = this.state.timeDiff ? moment.utc(this.state.timeDiff).format("HH:mm:ss").toString() : "00:00:00";
    var btnStyle = this.state.btnStyle;
    var startOrPause = (this.state.hasStarted && !this.state.isPaused) ? 
        this.togglePause.bind(this) : this.start.bind(this);
    return (
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.backgroundGradient}>
        <View style={styles.outerContainer}>
          <View style={styles.centerItem}>
            <Image style={styles.backgroundImage} source={require('./dharma_wheel.png')} />
          </View>
          <View style={styles.centerItem}>
            <Text style={styles.elapsedTime}>{elapsedTime}</Text>
          </View>
          <View style={styles.innerContainer}>
            <TouchableHighlight onPress={startOrPause} style={styles.btn}>
              <Text style={styles.startPauseText}>{this.state.startPauseText}</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.reset.bind(this)} style={styles.btn}>
              <Text style={styles.startPauseText}>Reset</Text>
            </TouchableHighlight>
          </View>
        </View>
      </LinearGradient>
    );
  }

  handleTick() {
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
  }

  start() {
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

    this.intervalFunction = setInterval(
      () => {
        that.handleTick();
      }, 1000
    );

    this.timeoutFunction = setTimeout(
      () => {
        let audio = that.state.queue.shift();
        that.playAudio.bind(that, audio);
      }, PLAY_AUDIO_1 - this.state.timeDiff
    )

  }

  playAudio(audio) {
    AudioPlayer.play(audio);
  }

  intervalFunction() {}

  timeoutFunction() {}

  togglePause() {
    var elapsedTime = this.state.timeDiff;
    this.setState({
      startPauseText: START_TEXT,
      btnStyle: "btn",
      isPaused: true,
      elapsedTime: elapsedTime,
    });

    AudioPlayer.pause();
    clearInterval(this.intervalFunction);
  }

  reset() {
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
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

}

const styles = StyleSheet.create({
  backgroundGradient: {
    flex: 1,
  },
  outerContainer: {
    marginTop: 25,
    flexDirection: 'column',
    flex:1,
    backgroundColor:'transparent'
  },
  innerContainer: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 40,
    marginRight: 40,
    backgroundColor:'transparent'
  },
  centerItem: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    shadowOffset: {width: 5, height: 5},
    shadowColor: "#000"
  },
  btnPause: {
    shadowOffset: {width: 5, height: 5},
    shadowColor: "#000"    
  },
  backgroundImage: {
    height:180,
    width:180,
  },
  startPauseText: {
    color:'#FFF',
    fontSize: 28,
    alignItems: 'center',
  },
  elapsedTime: {
    fontSize: 42,
    marginTop: 50,
    color:"#FFF",
  },
});

AppRegistry.registerComponent('VipassanaTimer', () => VipassanaTimer);
