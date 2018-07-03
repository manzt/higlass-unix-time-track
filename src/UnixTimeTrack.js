import { scaleUtc } from 'd3-scale';
import { utcFormat } from 'd3-time-format';
import { utcYear, utcMonth, utcWeek, utcDay, utcHour, utcMinute, utcSecond } from 'd3-time';

const durationSecond = 1000;
const durationMinute = durationSecond * 60;
const durationHour = durationMinute * 60;
const durationDay = durationHour * 24;
const durationWeek = durationDay * 7;
const durationYear = durationDay * 365;

const formatMillisecond = utcFormat('.%L');
const formatSecond = utcFormat(':%S');
const formatMinute = utcFormat('%I:%M');
const formatHour = utcFormat('%I %p');
const formatDay = utcFormat('%a %d');
const formatWeek = utcFormat('%b %d');
const formatMonth = utcFormat('%b');
const formatYear = utcFormat('%Y');

function formatTime(date) {
  return (utcSecond(date) < date ? formatMillisecond
    : utcMinute(date) < date ? formatSecond
      : utcHour(date) < date ? formatMinute
        : utcDay(date) < date ? formatHour
          : utcMonth(date) < date ? (utcWeek(date) < date ? formatDay : formatWeek)
            : utcYear(date) < date ? formatMonth
              : formatYear)(date);
}

const fmtSecond = utcFormat('%Y %b %d (%I:%M:%S %p)');
const fmtMinute = utcFormat('%Y %b %d (%I:%M %p)');
const fmtHour = utcFormat('%Y %b %d (%I %p)');
const fmtDay = utcFormat('%Y %b %d');
const fmtWeek = utcFormat('%Y %b');
const fmtMonth = utcFormat('%Y');
const fmtYear = utcFormat('');

function centerFormat(date, timeDelta) {
  return (timeDelta < durationSecond ? fmtSecond
    : timeDelta < durationMinute ? fmtMinute
      : timeDelta < durationHour ? fmtHour
        : timeDelta < durationDay ? fmtDay
          : timeDelta < durationWeek ? fmtWeek
            : timeDelta < durationYear ? fmtMonth
              : fmtYear)(date);
}


const UnixTimeTrack = (HGC, ...args) => {
  if (!new.target) {
    throw new Error(
      'Uncaught TypeError: Class constructor cannot be invoked without "new"',
    );
  }

  // HiGlass Code
  const { PIXI } = HGC.libraries;

  class UnixTimeTrackClass extends HGC.tracks.TiledPixiTrack {
    constructor(
      scene, trackConfig, dataConfig, handleTilesetInfoReceived, animate,
    ) {
      super(
        scene,
        dataConfig,
        handleTilesetInfoReceived,
        trackConfig.options,
        animate,
      );

      this.axisTexts = [];
      this.endpointsTexts = [];
      this.axisTextFontFamily = 'Arial';
      this.axisTextFontSize = 12;
    }


    createTimeTexts(tickValues) {
      let i = 0;
      const color = 'black';

      while (i < tickValues.length) {
        const tick = tickValues[i];

        while (this.axisTexts.length <= i) {
          const newText = new PIXI.Text(
            tick,
            {
              fontSize: `${this.axisTextFontSize}px`,
              fontFamily: this.axisTextFontFamily,
              fill: color,
            },
          );
          this.axisTexts.push(newText);
          this.pMain.addChild(newText);
        }

        this.axisTexts[i].text = formatTime(tick);
        this.axisTexts[i].anchor.y = 0.5;
        this.axisTexts[i].anchor.x = 0.5;
        i++;
      }

      while (this.axisTexts.length > tickValues.length) {
        const lastText = this.axisTexts.pop();
        this.pMain.removeChild(lastText);
      }
    }

    createEndpoints(tickValues, tickDiff) {
      let i = 0;
      const color = 'black';

      while (i < tickValues.length) {
        const tick = tickValues[i];

        while (this.endpointsTexts.length <= i) {
          const newText = new PIXI.Text(
            tick,
            {
              fontSize: `${this.axisTextFontSize}px`,
              fontFamily: this.axisTextFontFamily,
              fill: color,
            },
          );
          this.endpointsTexts.push(newText);
          this.pMain.addChild(newText);
        }

        this.endpointsTexts[i].text = centerFormat(tick, tickDiff);
        this.endpointsTexts[i].anchor.y = 0;
        this.endpointsTexts[i].anchor.x = 0.5;
        i++;
      }

      while (this.endpointsTexts.length > tickValues.length) {
        const lastText = this.endpointsTexts.pop();
        this.pMain.removeChild(lastText);
      }
    }

    createTimeScale() {
      const linearScale = this._xScale.copy();
      const timeScale = scaleUtc()
        .domain(linearScale.domain().map(d => d * 1000))
        .range(linearScale.range());
      return timeScale;
    }


    draw() {
      const timeScale = this.createTimeScale();
      const ticks = timeScale.ticks();
      this.createTimeTexts(ticks);
      const diff = (timeScale.domain()[1] - timeScale.domain()[0]) / 2;
      const endpoints = [+timeScale.domain()[0] + diff];
      const tickDiff = +ticks[1] - +ticks[0];
      this.createEndpoints(endpoints, tickDiff);

      const tickHeight = 10;
      const endpointHeight = 25;
      const textHeight = 10;
      const betweenTickAndText = 10;

      const tickStartY = (this.dimensions[1] - tickHeight - textHeight - betweenTickAndText) / 2;
      const tickEndY = tickStartY + tickHeight;
      const endpointEndY = tickStartY + endpointHeight;

      const graphics = this.pMain;
      graphics.clear();
      graphics.lineStyle(1, 0x000000, 1);

      ticks.forEach((tick, i) => {
        const xPos = this.position[0] + timeScale(tick);

        graphics.moveTo(xPos, this.position[1] + tickStartY);
        graphics.lineTo(xPos, this.position[1] + tickEndY);

        this.axisTexts[i].x = xPos;
        this.axisTexts[i].y = this.position[1] + tickEndY + betweenTickAndText;
      });

      endpoints.forEach((endpoint, i) => {
        const xPos = this.position[0] + timeScale(endpoint);

        graphics.moveTo(xPos, this.position[1] + tickStartY);
        graphics.lineTo(xPos, this.position[1] + tickEndY + 2);

        this.endpointsTexts[i].x = xPos;
        this.endpointsTexts[i].y = this.position[1] + endpointEndY;
      });
    }

    /* --------------------------- Getter / Setter ---------------------------- */

    zoomed(newXScale, newYScale) {
      this.xScale(newXScale);
      this.yScale(newYScale);

      this.draw();
    }
  }

  return new UnixTimeTrackClass(...args);
};

UnixTimeTrack.config = {
  type: 'unix-time-track',
  datatype: [],
  orientation: '1d-horizontal',
  name: 'UnixTime',
  availableOptions: [
  ],
  defaultOptions: {
  },
};

export default UnixTimeTrack;
