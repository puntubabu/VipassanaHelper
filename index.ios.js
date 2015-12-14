/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var moment = require('moment');

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
      timeDiff: null,
      startStopText: "Start",
      hasStarted: false,
    };
  },

  componentDidMount: function() {

  },

  handleTick: function() {
    var timeDiff = new Date().getTime() - this.state.startTime;
    this.setState({ timeDiff: timeDiff });
  },

  startOrStop: function() {

    var that = this;
    var startOrStopText;

    if (this.state.hasStarted) {

      startOrStopText = "Stop";
      this.setState({ hasStarted: false, });

    } else {

      startOrStopText = "Start";
      this.setState({ 
        startTime: new Date().getTime(),
        startStopText: startOrStopText,
        hasStarted: true,
      });
      this.intervalFunction = this.setInterval(
        () => {
          that.handleTick();
        }, 1000
      );
    }

  },

  intervalFunction: function() { },

  toggleInterval: function() {
    clearInterval(this.intervalFunction);
  },

  render: function() {

    var elapsedTime = this.state.timeDiff ? moment.utc(this.state.timeDiff).format("HH:mm:ss").toString() : "00:00:00";

    return (
      <View style={styles.container}>
        <Text>{elapsedTime}</Text>
        <View style={styles.container}>
          <TouchableHighlight onPress={this.startOrStop} style={styles.btn}>
            <Text>{this.state.startStopText}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  },

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  btn: {
    backgroundColor: '#F00',
  },
});

AppRegistry.registerComponent('VipassanaTimerApp', () => VipassanaTimerApp);
