Plotly.plot('graph', [{
    mode: 'text',
    x: [1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,4,5,6,1,2,3,4,5,6],
    y: [1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,5,5,5,5,5,5],
    text: ['🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸',
    '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸', '🩸'],
    // hovertemplate: 'This is you tooltip',
    type: 'scatter',
    textfont: {
      size: 25,
      color: 'black'
    },
    xaxis: {
        visible: false,
        title: '',
        autorange: true,
        showgrid: false,
        gridcolor: 'purple',
        gridwidth: 2,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: false,
        range: [0, 1]  // to set the xaxis range to 0 to 1
    },
    yaxis: {
        visible: false,
        title: '',
        autorange: true,
        showgrid: false,
        gridcolor: '#bdbdbd',
        gridwidth: .5,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: false,
        range: [0.5, 2.5]
    }
  }])
  
//   ['μ', '°', '±', 'Ͷ', 'Θ','ϕ','‣','	⃤','ℹ','ↆ','↔',
//            '∇','⌖','①','⑳','↹','◈','☂','★','✅', '✪','➤','⤨','⬗','🎮',
//            '🩸','🜲','🟀','','','','▶','🔔','⚠️','ℹ️','😅','⚽'],🩸🩸