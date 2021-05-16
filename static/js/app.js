const url = "http://robdunnlab.com/projects/belly-button-biodiversity/";


// Reading in data from samples.json for metadata elements
function createTable(sample){
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        var outputArray = metadata.filter(sampleNo => sampleNo.id == sample);
        var output = outputArray[0];
        var table = d3.select("#sample-metadata");
        table.html("");
        Object.entries(output).forEach(([key, value]) => {
            table.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

//Creating bar chart
function createCharts(sample){
    d3.json("data/samples.json").then((data) => {
        var samples = data.samples;
        var outputArray = samples.filter(sampleNo => sampleNo.id == sample);
        var output = outputArray[0];
        var sample_values = output.sample_values;
        var otu_ids = output.otu_ids;
        var otu_labels = output.otu_labels;
        var trace = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        };
        
        var barData = [trace];
        
        var barLayout = {
            title: "Top 10 Bacteria Cultures Found Bar Chart",
            margin:{t: 50,l: 100}
        };
        
        Plotly.newPlot("bar", barData, barLayout);

//Creating Bubble Chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids
             }
        };
        var bubbleData = [trace1];

        var bubbleLayout = {
            xaxis: {title:"OTU ID"},
            height: 600,
            width: 1200,
            title: "Bacteria Cultures Per Sample Bubble Chart"                  
                };              
                
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}
// Initializing 
function init() {
    // dropdown menu
    var dropdown = d3.select("#selDataset");
        d3.json("data/samples.json").then((data) => {
        var name = data.names;
        name.forEach((sample) => {
            dropdown.append("option").text(sample).property("value", sample);
        });
        var defValue = name[0];
        createTable(defValue);
        createCharts(defValue);
    });
}

function optionChanged(sample) {
    createTable(sample);
    createCharts(sample);
}

init()