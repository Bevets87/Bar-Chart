(function (d3) {

  'use strict'

  const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'

  const getDataSet = function (url,cb) {
    fetch(url)
    .then(function (response) {
      response.json().then(function (data) {
        cb(data)
      })
    })
    .catch(function (error) {
      console.log(error)
    })
  }


  const visualizeData = function (dataset) {
   // get dataset
    const data = dataset.data
   // set svg parameters to display bar graph
    const w = 1000
    const h = 500
    const paddingLeft = 100
    const paddingRight = 50
    const paddingTop = 50
    const paddingBottom = 80
   // make tooltip
    const div = d3.select('body').append('div')
                  .style('opacity', 0);
   // set months for tooltip
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
   // set svg
    const svg = d3.select('#app')
            .append('svg')
            .attr('width', w)
            .attr('height', h)
            .attr('fill', 'darkred')
    // set domain and range for x-linear-scale
    const minDate = d3.min(data, d => new Date(d[0]))
    const maxDate = d3.max(data, d => new Date(d[0]))
    const xScale = d3.scaleTime()
                   .domain([minDate, maxDate])
                   .range([paddingLeft, w - paddingRight])
   // set domain and range for y-linear-scale
    const maxGDP = d3.max(data, d => (d[1]))
    const yScale = d3.scaleLinear()
                   .domain([0,maxGDP])
                   .range([(h - paddingBottom), paddingTop])
   // display bar graph
                   svg.selectAll('rect')
                   .data(data)
                   .enter()
                   .append('rect')
                   .attr('x', function(d){
                     d[0] = new Date(d[0])
                      return xScale(d[0])
                   })
                   .attr('y', d => yScale(d[1]))
                   .attr('width', '5px')
                   .attr('height', d => (h -paddingBottom) - yScale(d[1]))
                   .on('mouseover', function(d) {
                    let date = new Date(d[0])
                    let year = date.getFullYear()
                    let month = months[date.getMonth()]
                   div.transition()
                   .duration(100)
                   .style('opacity', 1);
                   div.html(`${month}, ${year} <br> $${d[1]} Billion`)
                   .style('left', (d3.event.pageX) + 'px')
                   .style('top', (d3.event.pageY - 28) + 'px');
                   })
                   .on("mouseout", function(d) {
                   div.transition()
                   .duration(400)
                   .style("opacity", 0);
        });
     // make title
                svg.append('text')
                  .attr('x', w / 2)
                  .attr('y', h / 10)
                  .attr('text-anchor', 'middle')
                  .style('font-size', '30px')
                  .style('fill', 'white')
                  .text('US Gross Domestic Product')
   // make x-axis and label it
    const xAxis = d3.axisBottom(xScale)
                  svg.append('g')
                  .attr('transform','translate(0,' + yScale(0) + ')')
                  .style('font-size', '15px')
                  .call(xAxis)
                  .append('text')
                  .attr('text-anchor','middle')
                  .attr('x', w / 2)
                  .attr('y', 50)
                  .style('fill', 'black')
                  .style('font-weight','bold')
                  .text('Years')
  // make y-axis and label it
    const yAxis = d3.axisLeft(yScale)
                  svg.append('g')
                  .attr('transform','translate('+ xScale(minDate) +',0)')
                  .style('font-size', '15px')
                  .call(yAxis)
                  .append('text')
                  .attr('transform','rotate(-90)')
                  .attr('x', -175)
                  .attr('y', 20)
                  .style('fill', 'black')
                  .style('font-weight','bold')
                  .text('USD in Billions')
 }
  getDataSet(url,visualizeData)
}(d3))
