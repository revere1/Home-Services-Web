const chartGroups = [
  {
    name: 'Bar Charts',
    charts: [
      {
        name: 'Vertical Bar Chart',
        selector: 'bar-vertical',
        inputFormat: 'singleSeries',
        options: [
          'animations', 'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient', 'barPadding',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel',
          'showGridLines', 'roundDomains', 'tooltipDisabled', 'roundEdges', 'yScaleMax'
        ]
      },
      {
        name: 'Horizontal Bar Chart',
        selector: 'bar-horizontal',
        inputFormat: 'singleSeries',
        options: [
          'animations', 'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient', 'barPadding',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel', 'yAxisLabel',
          'showGridLines', 'roundDomains', 'tooltipDisabled', 'roundEdges', 'xScaleMax'
        ],
        defaults: {
          yAxisLabel: 'Country',
          xAxisLabel: 'GDP Per Capita',
        }
      },
    ]
  },
  {
    name: 'Pie Charts',
    charts: [
      {
        name: 'Pie Chart',
        selector: 'pie-chart',
        inputFormat: 'singleSeries',
        options: [
          'animations', 'colorScheme', 'gradient', 'showLegend', 'legendTitle', 'doughnut', 'arcWidth',
          'explodeSlices', 'showLabels', 'tooltipDisabled'
        ]
      }
    ]
  },
  {
    name: 'Line/Area Charts',
    charts: [
      {
        name: 'Line Chart',
        selector: 'line-chart',
        inputFormat: 'multiSeries',
        options: [
          'animations', 'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel',
          'yAxisLabel', 'autoScale', 'timeline', 'showGridLines', 'curve',
          'rangeFillOpacity', 'roundDomains', 'tooltipDisabled', 'showRefLines',
          'referenceLines', 'showRefLabels',
          'xScaleMin', 'xScaleMax', 'yScaleMin', 'yScaleMax'
        ],
        defaults: {
          yAxisLabel: 'GDP Per Capita',
          xAxisLabel: 'Census Date',
          linearScale: true
        }
      },
      {
        name: 'Area Chart',
        selector: 'area-chart',
        inputFormat: 'multiSeries',
        options: [
          'animations', 'colorScheme', 'schemeType', 'showXAxis', 'showYAxis', 'gradient',
          'showLegend', 'legendTitle', 'showXAxisLabel', 'xAxisLabel', 'showYAxisLabel',
          'yAxisLabel', 'autoScale', 'timeline', 'showGridLines', 'curve',
          'roundDomains', 'tooltipDisabled',
          'xScaleMin', 'xScaleMax', 'yScaleMin', 'yScaleMax'
        ],
        defaults: {
          yAxisLabel: 'GDP Per Capita',
          xAxisLabel: 'Census Date',
          linearScale: true
        }
      }
    ]
  }
];

export default chartGroups;
