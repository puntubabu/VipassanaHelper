'use strict';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';
import React, { Component } from 'react';

import LinearGradient from 'react-native-linear-gradient';
import AudioPlayer from 'react-native-audioplayer';
import moment from 'moment';
const timer = require('react-native-timer');

const START_TEXT = 'Start',
      PAUSE_TEXT = 'Pause',
      RESET_TEXT = 'Reset',
      AUDIO_0 = 'a.mp3',
      AUDIO_1 = 'b.mp3',
      AUDIO_2 = 'c.mp3',
      PLAY_AUDIO_1 = 270000,
      PLAY_AUDIO_2 = 554000,
      PADDING = 2000;

class VipassanaTimer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      startPauseText: "Start",
      hasStarted: false,
      isPaused: undefined,
      btnStyle: "btn",
      elapsedTime:0,
      audioQueue: [
        { trackName: AUDIO_1, playTime: PLAY_AUDIO_1 }, 
        { trackName: AUDIO_2, playTime: PLAY_AUDIO_2 }
      ]
    }
  }

  componentWillUnmount() {
    clearTimeout(timer);
    clearInterval(timer);
  }

  intervalFunction() {}

  render() {
    //let elapsedTime = this.state.timeDiff ? moment.utc(this.state.timeDiff).format("HH:mm:ss").toString() : "00:00:00";
    let btnStyle = this.state.btnStyle;
    const startOrPause = this.state.hasStarted ? this.startTimer : this.pauseTimer;

    return (
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.backgroundGradient}>
        <View style={styles.outerContainer}>
          <View style={styles.centerItem}>
            <Image style={styles.backgroundImage} source={require('./dharma_wheel.png')} />
          </View>
          <View style={styles.centerItem}>
            <Text style={styles.elapsedTime}>{this.state.elapsedTime}</Text>
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
  
  maybePlayNextAudio = (elapsedTime) => {
    const nextInQueue = this.state.audioQueue[0];
    if (nextInQueue && (elapsedTime === nextInQueue.playTime)) {
      AudioPlayer.play(nextInQueue.trackName);
      const newQueue = this.state.audioQueue.shift();
      this.setState({ audioQueue: newQueue });
    }
  }

  handleTick() {
    const incrementedTime = this.state.elapsedTime + 1;
    if (incrementedTime === 3600) {
      AudioPlayer.stop();
      clearInterval(timer);
    } else {
      this.setState({ elapsedTime: incrementedTime }, () => this.maybePlayNextAudio(incrementedTime));      
    }
  }

  startTimer = () => {
    // if timer has been started before, then we are resuming timer
    if (this.state.hasStarted) {
      this.resumeTimer();
    } else {
      this.initialStartTimer();
    }
  }
  
  pauseTimer = () => {
    const that = this;
    const elapsedTime = this.state.elapsedTime;
    this.setState({
      startPauseText: START_TEXT,
      btnStyle: "btnStart",
      isPaused: true
    }, () => {
      AudioPlayer.pause();
      clearInterval(timer);
    });
  };

  initialStartTimer = () => {
    const that = this;
    this.setState({
      startPauseText: PAUSE_TEXT,
      btnStyle: "btnPause",
      isPaused: false
    }, () => {
      //AudioPlayer.play();
      timer.setInterval(() => that.handleTick) 
    });
  };

  resumeTimer = () => {
    const that = this;
    this.setState({
      startPauseText: PAUSE_TEXT,
      btnStyle: "btnPause",
      isPaused: false
    }, () => {
      AudioPlayer.start();
      timer.setInterval(() => that.handleTick, 1000);
    });
  };

  playAudio(audio) {
    AudioPlayer.play(audio);
  }

  reset() {
    this.setState({ 
      startPauseText: START_TEXT,
      hasStarted:false,
      isPaused: null,
      btnStyle: "btn",
      elapsedTime: 0,
    },
    () => {
      AudioPlayer.stop();
      clearInterval(this.intervalFunction);
    });
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
