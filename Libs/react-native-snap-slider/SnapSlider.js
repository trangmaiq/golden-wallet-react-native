'use strict';
import AppStyle from '../../app/commons/AppStyle'
var React = require('react');
var ReactNative = require('react-native');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');

var {
  StyleSheet,
  Slider,
  Text,
  View,
  ViewPropTypes,
  Dimensions,
  Platform
} = ReactNative;

var SnapSlider = createReactClass({
  propTypes: {
    onSlidingComplete: PropTypes.func,
    style: ViewPropTypes.style,
    containerStyle: ViewPropTypes.style,
    itemWrapperStyle: ViewPropTypes.style,
    itemStyle: Text.propTypes.style,
    items: PropTypes.array.isRequired,
    defaultItem: PropTypes.number,
    labelPosition: PropTypes.string,
    onWidth: PropTypes.number
  },
  getInitialState() {
    var sliderRatio = this.props.maximumValue / (this.props.items.length - 1);
    var value = sliderRatio * this.props.defaultItem;
    var item = this.props.defaultItem;
    return {
      sliderRatio: sliderRatio,
      value: value,
      item: item,
      adjustSign: 1,
      itemWidth: [],
      sliderWidth: 0,
      sliderLeft: 0,
    };
  },
  getDefaultProps() {
    return {
      minimumValue: 0,
      maximumValue: 1,
    };
  },
  // _sliderStyle() {
  //   return [defaultStyles.slider, { width: this.state.sliderWidth, left: this.state.sliderLeft }, this.props.style];
  // },
  _onSlidingCompleteCallback: function (v) {
    //pad the value to the snap position
    var halfRatio = this.state.sliderRatio / 2;
    var i = 0;
    for (; ;) {
      if ((v < this.state.sliderRatio) || (v <= 0)) {
        if (v >= halfRatio) {
          i++;
        }
        break;
      }
      v = v - this.state.sliderRatio;
      i++;
    }
    var value = this.state.sliderRatio * i;

    //Move the slider
    value = value + (this.state.adjustSign * 0.000001);//enforce UI update
    if (this.state.adjustSign > 0) {
      this.setState({ adjustSign: -1 });
    } else {
      this.setState({ adjustSign: 1 });
    }
    this.setState({ value: value, item: i }, () =>
      //callback
      this.props.onSlidingComplete(i)
    );

  },
  /*
  componentWillUpdate() {
      //get the width for all items
      var iw = [];
      for (var i = 0; i < this.props.items.length; i++) {
          var node = eval('this.refs.t' + i);
          node.measure(function (ox, oy, width, height, px, py) {
              iw.push(width);
          });
      }
  },
  */
  _getItemWidth: function (x) {
    var width = x.nativeEvent.layout.width;
    var itemWidth = this.state.itemWidth;
    itemWidth.push(width);
    this.setState({ itemWidth: itemWidth });
    //we have all itemWidth determined, let's update the silder width
    if (this.state.itemWidth.length == this.props.items.length) {
      var max = Math.max.apply(null, this.state.itemWidth);
      if (this.refs.slider && this.state.sliderWidth > 0) {
        var that = this;
        var w, l;
        var buffer = 30;//add buffer for the slider 'ball' control
        if (buffer > w) {
          buffer = 0;
        }
        w = that.state.sliderWidth - max;
        w = w + buffer;
        l = max / 2;
        l = l - buffer / 2;
        that.setState({ sliderWidth: w });
        that.setState({ sliderLeft: l });
      }
    }
  },
  _getSliderWidth: function (e) {
    var { x, y, width, height } = e.nativeEvent.layout;
    this.setState({ sliderWidth: width });
  },
  _labelView() {
    var itemStyle = [defaultStyles.item, this.props.itemStyle];
    let labels = this.props.items.map((i, j) => i.label ? (<Text key={i.value} ref={"t" + j} style={[itemStyle, { marginRight: i.margin }]} onLayout={this._getItemWidth}>{i.label}</Text>) : null);
    return (
      <View style={[defaultStyles.itemWrapper, this.props.itemWrapperStyle]}>
        {labels}
      </View>
    );
  },
  _lineBetween() {
    const { width } = Dimensions.get('window')
    const widthLine = Platform.OS === 'ios' ? width - 44 : width - 70
    const topLine = Platform.OS === 'ios' ? 16.5 : 5.5
    const leftLine = Platform.OS === 'ios' ? 22 : 35
    let lines = this.props.items.map((i, j) => <View key={j} style={{ height: 7, width: 1, backgroundColor: AppStyle.secondaryTextColor }} />);
    return (
      <View style={{ height: 7, width: widthLine, flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', top: topLine, left: leftLine }}>
        {lines}
      </View>
    )
  },
  render() {
    var that = this;
    return (
      <View onLayout={that._getSliderWidth} style={[defaultStyles.container, this.props.containerStyle, { marginTop: 10 }]}>
        {this._lineBetween()}
        {this.props.labelPosition == 'top' ? this._labelView() : null}
        <Slider
          minimumTrackTintColor={AppStyle.secondaryTextColor}
          thumbImage={require('./../../app/assets/images/Oval.png')}
          maximumTrackTintColor={AppStyle.secondaryTextColor}
          style={{ paddingHorizontal: 20, alignSelf: 'center', width: this.props.onWidth - 40 }}
          ref="slider" {...this.props} onSlidingComplete={(value) => this._onSlidingCompleteCallback(value)} value={this.state.value} />
        {this.props.labelPosition === undefined || this.props.labelPosition == 'bottom' ? this._labelView() : null}
      </View>
    );
  }
});

var defaultStyles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    paddingHorizontal: 20
  },
  slider: {
  },
  itemWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 4
  },
  item: {
  },
});

module.exports = SnapSlider;