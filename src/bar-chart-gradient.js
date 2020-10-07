import React from 'react'
import { View } from 'react-native'
import { Svg, Rect, G, Text, Line, LinearGradient, Stop, Defs } from 'react-native-svg'
import AbstractChart from './abstract-chart'

const barWidth = 10

class BarChart extends AbstractChart {
  getBarPercentage = () => {
    const { barPercentage = 1 } = this.props.chartConfig;
    return barPercentage;
  };

  renderStop = (condition, offset) => {
    let localOffset = offset === 2 ? 1 : offset;
    if (condition) {
      return <Stop offset={localOffset.toString()} stopColor={offset === 0 ? '#1CBA66' : (offset === 1 ? '#39E11C' : '#FFED47')} />
    }
  }

  renderBars = config => {
    const { data, width, height, paddingTop, paddingRight } = config
    const baseHeight = this.calcBaseHeight(data, height)
    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height)
      const barWidth = 10
      const exCurBarData = this.props.exercisesChartInfo;
      if (!exCurBarData || !Array.isArray(exCurBarData) || exCurBarData.length <= 0) return null
      let firstStConColor = exCurBarData && exCurBarData[i] && exCurBarData[i].length > 0 && exCurBarData[i][0] > 0 ? true : false;
      let secondStConColor = exCurBarData && exCurBarData[i] && exCurBarData[i].length > 0 && exCurBarData[i][0] > 0 ? true : false;
      let thirdStConColor = exCurBarData && exCurBarData[i] && exCurBarData[i].length > 0 && exCurBarData[i][0] > 0 ? true : false && exCurBarData[i][2] && exCurBarData[i][1] <= 0 ? true : false;
      return (
        <G>
          <Defs>
            {firstStConColor || secondStConColor || thirdStConColor ?
              <LinearGradient id="path"
                x1="0" y1="100%" x2="0" y2="0">
                {this.renderStop(firstStConColor, 0)}
                {this.renderStop(secondStConColor, 1)}
                {this.renderStop(thirdStConColor, 2)}
                {/* {renderStop(firstStConColor, 0)} */}
                {/* {firstStConColor && <Stop offset="1" stopColor={'#39E11C'} />} */}
                {/* {secondStConColor && <Stop offset="1" stopColor={'#1CBA66'} />} */}
                {/* {thirdStConColor && <Stop offset="2" stopColor={'#FFED47'} />} */}
                {/* <Stop offset="1" stopColor={'#39E11C'} />
              <Stop offset="2" stopColor={'#FFED47'} />
              <Stop offset="0" stopColor={'#FFED47'} />  */}
              </LinearGradient> : null
            }
          </Defs>
          <Rect
            key={Math.random()}
            x={
              paddingRight +
              (i * (width - paddingRight)) / data.length +
              barWidth / 2
            }
            y={
              ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 +
              paddingTop
            }
            rx={5}
            width={barWidth}
            height={(Math.abs(barHeight) / 4) * 3}
            fill={"url(#path)"}
          >
          </Rect>
        </G>
      )
    })
  }

  renderBarTops = config => {
    const { data, width, height, paddingTop, paddingRight } = config
    const baseHeight = this.calcBaseHeight(data, height)
    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height)
      return (
        <Rect
          key={Math.random()}
          x={
            paddingRight +
            (i * (width - paddingRight)) / data.length +
            barWidth / 2
          }
          y={((baseHeight - barHeight) / 4) * 3 + paddingTop}
          width={barWidth}
          height={2}
          fill={'rgba(0,0,0,0)'}
        />
      )
    })
  }

  renderValuesOnTopOfBars = ({
    data,
    width,
    height,
    paddingTop,
    paddingRight
  }: Pick<
    Omit<AbstractChartConfig, "data">,
    "width" | "height" | "paddingRight" | "paddingTop"
  > & {
    data: number[];
  }) => {
    const baseHeight = this.calcBaseHeight(data, height);

    return data.map((x, i) => {
      const barHeight = this.calcHeight(x, data, height);
      const barWidth = 32 * this.getBarPercentage();

      return (
        <Text
          key={Math.random()}
          x={
            paddingRight +
            (i * (width - paddingRight)) / data.length +
            barWidth / 1
          }
          y={((baseHeight - barHeight) / 4) * 3 + paddingTop - 7.5}
          fill={'#23335B'}
          fontSize="12"
          textAnchor="middle"
        >
          {data[i]}
        </Text>
      );
    });
  };

  renderHorLabels = config => {
    const {
      count,
      data,
      height,
      paddingTop,
      paddingRight,
      yLabelsOffset = 12
    } = config
    const decimalPlaces = this.props.chartConfig.decimalPlaces === undefined ? 2 : this.props.chartConfig.decimalPlaces
    const yAxisLabel = this.props.yAxisLabel || ''

    return [...new Array(count)].map((_, i) => {
      let yLabel

      if (count === 1) {
        yLabel = `${yAxisLabel}${data[0].toFixed(decimalPlaces)}`
      } else {
        const label = this.props.fromZero ?
          (this.calcScaler(data) / (count - 1)) * i + Math.min(...data, 0) :
          (this.calcScaler(data) / (count - 1)) * i + Math.min(...data)
        yLabel = `${yAxisLabel}${label.toFixed(decimalPlaces)}`
      }

      return (
        <Text
          key={Math.random()}
          x={paddingRight - yLabelsOffset}
          textAnchor="end"
          y={(height * 3) / 4 - ((height - paddingTop) / count) * i + 12}
          fontSize={12}
          fontWeight="700"
          fill={'#9BA1AE'}
        >
          {parseInt(yLabel) !== 0 && parseInt(yLabel) + '%'}
        </Text>
      )
    })
  }

  renderVerLabels = config => {
    const {
      labels = [],
      width,
      height,
      paddingRight,
      paddingTop,
      horizontalOffset = 0,
      stackedBar = false
    } = config
    const fontSize = 12
    let fac = 1
    if (stackedBar) {
      fac = 0.71
    }

    return labels.map((label, i) => {
      return (
        <Text
          key={Math.random()}
          x={
            (((width - paddingRight) / labels.length) * i +
              paddingRight +
              horizontalOffset) *
            fac
          }
          y={(height * 3) / 4 + paddingTop + fontSize * 2}
          fontSize={12}
          fill={'#9BA1AE'}
          textAnchor="middle"
          fontWeight="700"
        >
          {label}
        </Text>
      )
    })
  }

  renderHorLines = config => {
    const { width, height, paddingTop, paddingRight } = config
    return (
      <G>
        <Line
          key={Math.random()}
          x1={paddingRight}
          y1={height - height / 4 + paddingTop - paddingTop * 2.25}
          x2={width}
          y2={height - height / 4 + paddingTop - paddingTop * 2.25}
          stroke={'rgba(240, 240, 248, 1)'}
          strokeDasharray="0, 0"
          fill={'rgba(240, 240, 248, 1)'}
          strokeWidth={1}
        />
        <Line
          key={Math.random()}
          x1={paddingRight}
          y1={height - height / 4 + paddingTop - paddingTop * 4.5}
          x2={width}
          y2={height - height / 4 + paddingTop - paddingTop * 4.5}
          stroke={'rgba(240, 240, 248, 1)'}
          strokeDasharray="0, 0"
          fill={'rgba(240, 240, 248, 1)'}
          strokeWidth={1}
        />
        <Line
          key={Math.random()}
          x1={paddingRight}
          y1={height - height / 4 + paddingTop - paddingTop * 6.75}
          x2={width}
          y2={height - height / 4 + paddingTop - paddingTop * 6.75}
          stroke={'rgba(240, 240, 248, 1)'}
          strokeDasharray="0, 0"
          fill={'rgba(240, 240, 248, 1)'}
          strokeWidth={1}
        />
        <Line
          key={Math.random()}
          x1={paddingRight}
          y1={height - height / 4 + paddingTop - paddingTop * 9}
          x2={width}
          y2={height - height / 4 + paddingTop - paddingTop * 9}
          stroke={'rgba(240, 240, 248, 1)'}
          strokeDasharray="0, 0"
          fill={'rgba(240, 240, 248, 1)'}
          strokeWidth={1}
        />
        <Line
          key={Math.random()}
          x1={paddingRight}
          y1={height - height / 4 + paddingTop - paddingTop * 11.25}
          x2={width}
          y2={height - height / 4 + paddingTop - paddingTop * 11.25}
          stroke={'rgba(240, 240, 248, 1)'}
          strokeDasharray="0, 0"
          fill={'rgba(240, 240, 248, 1)'}
          strokeWidth={1}
        />
        <Line
          key={Math.random()}
          x1={paddingRight}
          y1={height - height / 4 + paddingTop - paddingTop * 13.5}
          x2={width}
          y2={height - height / 4 + paddingTop - paddingTop * 13.5}
          stroke={'rgba(240, 240, 248, 1)'}
          strokeDasharray="0, 0"
          fill={'rgba(240, 240, 248, 1)'}
          strokeWidth={1}
        />
        <Line
          key={Math.random()}
          x1={paddingRight}
          y1={height - height / 4 + paddingTop}
          x2={width}
          y2={height - height / 4 + paddingTop}
          stroke={'rgba(240, 240, 248, 1)'}
          strokeDasharray="0, 0"
          fill={'rgba(240, 240, 248, 1)'}
          strokeWidth={1}
        />
      </G>
    )
  }

  render() {
    const paddingTop = 16
    const paddingRight = 62.5
    const {
      width,
      height,
      data,
      style = {},
      withHorizontalLabels = true,
      withVerticalLabels = true,
    } = this.props
    const { borderRadius = 0 } = style
    const config = {
      width,
      height
    }
    return (
      <View style={style}>
        <Svg height={height} width={width}>
          {this.renderDefs({
            ...config,
            ...this.props.chartConfig
          })}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="rgba(0,0,0,0)"
          />
          <G>
            {this.renderHorLines({
              ...config,
              count: 4,
              paddingTop
            })}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorLabels({
                ...config,
                count: 4,
                data: data.datasets[0].data,
                paddingTop,
                paddingRight
              })
              : null}
          </G>
          <G>
            {withVerticalLabels
              ? this.renderVerLabels({
                ...config,
                labels: data.labels,
                paddingRight,
                paddingTop,
                horizontalOffset: barWidth
              })
              : null}
          </G>
          <G>
            {this.renderBars({
              ...config,
              data: data.datasets[0].data,
              paddingTop,
              paddingRight
            })}
          </G>

          {/* NO NEED HERE */}
          {/* <G>
            {this.renderBarTops({
              ...config,
              data: data.datasets[0].data,
              paddingTop,
              paddingRight
            })}
          </G> */}
        </Svg>
      </View>
    )
  }
}

export default BarChart
