// data from jupyter notebook
const data = [
    {
        x: ["A", "A♯/B♭", "B", "C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭"],
        y: [4, 1, 2, 9, 7, 7, 2, 3, 1, 5, 7, 10],
        type: 'bar',
        name: 'Major',
        marker: {
            color: '#87CEEB',
            line: {
                color: 'DarkSlateGrey',
                width: 1
            }
        },
        hovertemplate: 'Key: %{x}<br>Count: %{y}'
    },
    {
        x: ["A", "A♯/B♭", "B", "C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭"],
        y: [3, 4, 3, 4, 6, 2, 1, 4, 2, 6, 4, 3],
        type: 'bar',
        name: 'Minor',
        marker: {
            color: '#FA8072',
            line: {
                color: 'DarkSlateGrey',
                width: 1
            }
        },
        hovertemplate: 'Key: %{x}<br>Count: %{y}'
    }
];

const layout = {
    title: {
        text: 'Number of Songs per Musical Key (Major vs Minor)'
    },
    xaxis: {
        title: {
            text: 'Musical Key'
        },
        tickmode: 'linear'
    },
    yaxis: {
        title: {
            text: 'Number of Songs'
        }
    },
    barmode: 'stack',
    hovermode: 'x unified',
    plot_bgcolor: 'white',
    legend: {
        title: {
            text: 'Mode'
        }
    }
};
Plotly.newPlot('plotly-chart', data, layout); 