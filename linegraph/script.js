// Set the dimensions and margins of the graph
const margin = {top: 40, right: 40, bottom: 60, left: 60};
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG container
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create tooltip div
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load and process the data
d3.csv("../data/ds4200_spotify_data.csv")
    .then(function(data) {
        console.log("Data loaded successfully:", data); // Debug log

        // Convert release_date to decade and duration_ms to minutes
        data.forEach(d => {
            d.year = new Date(d.release_date).getFullYear();
            d.decade = Math.floor(d.year / 10) * 10;
            d.duration_min = d.duration_ms / 60000; // Convert to minutes
        });

        // Group by decade and calculate statistics
        const decadeStats = d3.rollup(data,
            v => ({
                avg: d3.mean(v, d => d.duration_min),
                max: d3.max(v, d => d.duration_min),
                min: d3.min(v, d => d.duration_min)
            }),
            d => d.decade
        );

        // Convert Map to array and sort by decade
        const decadeData = Array.from(decadeStats, ([decade, stats]) => ({
            decade: decade,
            ...stats
        })).sort((a, b) => a.decade - b.decade);

        // Create scales
        const xScale = d3.scaleLinear()
            .domain([d3.min(decadeData, d => d.decade), d3.max(decadeData, d => d.decade)])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(decadeData, d => d.avg) * 1.2])
            .range([height, 0]);

        // Create line generator
        const line = d3.line()
            .x(d => xScale(d.decade))
            .y(d => yScale(d.avg));

        // Add the line
        svg.append("path")
            .datum(decadeData)
            .attr("class", "line")
            .attr("d", line);

        // Add dots
        svg.selectAll(".dot")
            .data(decadeData)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.decade))
            .attr("cy", d => yScale(d.avg))
            .attr("r", 5)
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(
                    `Decade: ${d.decade}s<br/>` +
                    `Average: ${d.avg.toFixed(2)} min<br/>` +
                    `Max: ${d.max.toFixed(2)} min<br/>` +
                    `Min: ${d.min.toFixed(2)} min`
                )
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickFormat(d => d + "s"))
            .append("text")
            .attr("x", width/2)
            .attr("y", 40)
            .attr("fill", "black")
            .style("text-anchor", "middle")
            .text("Decade");

        // Add Y axis
        svg.append("g")
            .call(d3.axisLeft(yScale))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -40)
            .attr("x", -height/2)
            .attr("fill", "black")
            .style("text-anchor", "middle")
            .text("Average Duration (minutes)");

        // Add title
        svg.append("text")
            .attr("x", width/2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Average Song Duration by Decade");
    })
    .catch(function(error) {
        // Error handling
        console.error("Error loading the data:", error);
        d3.select("#chart")
            .append("p")
            .style("color", "red")
            .text("Error loading data. Please check if ds4200_spotify_data.csv is in the correct location.");
    }); 