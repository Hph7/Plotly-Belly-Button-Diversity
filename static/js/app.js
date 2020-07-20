// when the change event takes place build function to build the plot and to get the demographic information based on the testid
function optionChanged(testid) {
  buildplots(testid)
  demographics(testid)
}

function buildplots(testid){
  // get the data from samples.json
  d3.json("samples.json").then(data=>{
    // console.log(data)
    // get the otu_ids,sample_values,otu_labels
    var otuids = data.samples[0].otu_ids;
    // console.log(otuids)
    var samplevalues = data.samples[0].sample_values
    // console.log(samplevalues)
    var otulabels = data.samples[0].otu_labels
    // console.log(otulabels)
    // get only the top 10 otuids
    var topten_otu = otuids.slice(0,10).map(d => "OTU " + d)
    // console.log(topten_otu)
    var topten_otulabels = otulabels.slice(0,10)
    var topten_values = samplevalues.slice(0,10)

    var trace = {
      x: topten_values,
      y: topten_otu,
      text: topten_otulabels,
      type: "bar",
      orientation: "h",
      marker: { color: 'purple'}
    }

    var trace1 = {
      x: otuids,
      y: samplevalues,
      text: otulabels,
      mode:"markers",
      marker:{
        size: samplevalues,
        color: otuids,
        colorscale: "Earth"
      }
    }

    var data1 = [trace];
    var data2 = [trace1];

    // create layout variable to set plots layout
    var layout = {
      title: "Top 10 OTU",
      yaxis:{
          tickmode:"linear",
      },
      margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 30
      }
    };

    var layout1 = {
      xaxis: {title: "Otu ID"}
    }

    Plotly.newPlot("bar", data1, layout)
    Plotly.newPlot("bubble", data2, layout1)
  })
}

// create the function to get the necessary data
function demographics(testid) {
  // read the json file to get data
  d3.json("samples.json").then((data)=> {
  // get the metadata info for the demographic panel
  var metadata = data.metadata;
  console.log(metadata)
  //get the first element 
  var first = metadata[0];
  console.log(first)

  // select panel to put data
  var demographicInfo = d3.select("#sample-metadata");
    
  // empty the demographic info panel before getting new id info
  demographicInfo.html("");

  // append the info 
  Object.entries(first).forEach((x) => {   
    demographicInfo.append("h6").text(x[0].toUpperCase() + ": " + x[1] + "\n");    
  });
  });
}

// create the initialization for the starting visualization
function init(){
  // on the dropdown menu
  var dropdown = d3.select("#selDataset")
  //get the data from the json file 
  d3.json("samples.json").then(data=>{
    data.names.forEach((sample) => {
      dropdown
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    var firstSample = data[0];
    buildplots(firstSample);
    demographics(firstSample);
  });
}
init();