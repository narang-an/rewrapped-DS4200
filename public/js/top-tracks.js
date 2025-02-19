// Get top 10 tracks
const top10Tracks = tracksData.slice(0, 10);

// Set up the dimensions
const margin = { top: 20, right: 20, bottom: 120, left: 100 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG container
const svg = d3.select("#visualization")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Create scales
const x = d3.scaleBand()
  .range([0, width])
  .domain(top10Tracks.map(d => d.name))
  .padding(0.2);

const y = d3.scaleLinear()
  .domain([0, d3.max(top10Tracks, d => d.popularity)])
  .range([height, 0]);

// Add X axis
svg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end")
  .style("font-size", "10px");

// Add X axis label
svg.append("text")
  .attr("transform", `translate(${width/2},${height + margin.bottom - 10})`)
  .style("text-anchor", "middle")
  .text("Track Name");

svg.append("g")
// Add Y axis
svg.append("g")
  .call(d3.axisLeft(y));

// Add Y axis label
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Popularity Score");

// Create bars
svg.selectAll("rect")
  .data(top10Tracks)
  .join("rect")
  .attr("class", "bar")
  .attr("x", d => x(d.name))
  .attr("y", d => y(d.popularity))
  .attr("width", x.bandwidth())
  .attr("height", d => height - y(d.popularity));

// Add tooltips
svg.selectAll("rect")
  .append("title")
  .text(d => `${d.name} by ${d.artists[0].name}\nPopularity: ${d.popularity}`); 