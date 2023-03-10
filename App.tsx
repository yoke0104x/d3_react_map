import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const Globe = (props) => {
  const { width, height } = props;
  const ref = useRef();
  const timeRefId = useRef<any>();
  useEffect(() => {
    getJson().then();
  }, []);

  const getJson = async () => {
    console.log(width, height);
    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height);

    // 地图投影
    const projection = d3
      .geoOrthographic()
      .scale(250)
      .translate([width / 2, height / 2])
      .rotate([0, -30]);

    // 地理路径生成器
    const path = d3.geoPath().projection(projection);
    console.log(topojson);
    // 获取世界地图数据
    let data = await d3.json('https://unpkg.com/world-atlas@1/world/110m.json');
    const countries = topojson.feature(data, data.objects.countries).features;

    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'skyblue');

    // 绘制地图
    svg
      .selectAll('path')
      .data(countries)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#69b3a2')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);

    // 添加拖拽旋转功能
    let dragStart;
    let rotateStart;

    function dragstarted(event) {
      console.log(event);
      console.log(d3.pointer(event));
      dragStart = d3.pointer(event);
      rotateStart = projection.rotate();
    }

    function dragged(event) {
      const dragEnd = d3.pointer(event);
      const rotateEnd = [
        rotateStart[0] + (dragEnd[0] - dragStart[0]) / 4,
        rotateStart[1] - (dragEnd[1] - dragStart[1]) / 4,
        rotateStart[2],
      ];
      projection.rotate(rotateEnd);
      svg.selectAll('path').attr('d', path);
    }

    svg.call(d3.drag().on('start', dragstarted).on('drag', dragged));

    // 自动旋转地球
    let rotate = [0, -30];
    ref.current.addEventListener('mouseover', () => {
      clearInterval(timeRefId.current);
    });

    ref.current.addEventListener('mouseout', () => {
      timeRefId.current = setInterval(() => {
        rotate[0] += 1;
        projection.rotate(rotate);
        svg.selectAll('path').attr('d', path);
      }, 50);
    });

    timeRefId.current = setInterval(() => {
      rotate[0] += 1;
      projection.rotate(rotate);
      svg.selectAll('path').attr('d', path);
    }, 50);
  };

  return (
    <div>
      <svg ref={ref} />
    </div>
  );
};

export default Globe;
