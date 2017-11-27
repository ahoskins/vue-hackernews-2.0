<template>
  <svg width="960" height="570"></svg>
</template>

<script>


export default {
  name: 'user-view',

  computed: {
    user () {
      return this.$store.state.users[this.$route.params.id]
    }
  },

  beforeMount () {
      // this.getTransactions()
      this.createTreemap()
  },

  data () {
      return {
          data: {
    "name": "flare",
    "children": [
     {
      "name": "analytics",
      "children": [
      {"name": "AgglomerativeCluster", "size": 3938},
      {"name": "CommunityStructure", "size": 3812},
      {"name": "HierarchicalCluster", "size": 6714},
      {"name": "MergeEdge", "size": 743}
      ]
     },
     {
      "name": "animate",
      "children": [
       {"name": "Easing", "size": 17010},
       {"name": "FunctionSequence", "size": 5842},
       {"name": "ISchedulable", "size": 1041},
       {"name": "Parallel", "size": 5176},
       {"name": "Pause", "size": 449},
       {"name": "Scheduler", "size": 5593},
       {"name": "Sequence", "size": 5534},
       {"name": "Transition", "size": 9201},
       {"name": "Transitioner", "size": 19975},
       {"name": "TransitionEvent", "size": 1116},
       {"name": "Tween", "size": 6006}
      ]
     },
     {
      "name": "data",
      "children": [
       {"name": "DataField", "size": 1759},
       {"name": "DataSchema", "size": 2165},
       {"name": "DataSource", "size": 3331},
       {"name": "DataTable", "size": 772},
       {"name": "DataUtil", "size": 3322}
      ]
     },
     {
      "name": "display",
      "children": [
       {"name": "DirtySprite", "size": 8833},
       {"name": "LineSprite", "size": 1732},
       {"name": "RectSprite", "size": 3623},
       {"name": "TextSprite", "size": 10066}
      ]
     },
     {
      "name": "flex",
      "children": [
       {"name": "FlareVis", "size": 4116}
      ]
     },
     {
      "name": "physics",
      "children": [
       {"name": "DragForce", "size": 1082},
       {"name": "GravityForce", "size": 1336},
       {"name": "NBodyForce", "size": 10498},
       {"name": "Particle", "size": 2822},
       {"name": "Simulation", "size": 9983},
       {"name": "Spring", "size": 2213},
       {"name": "SpringForce", "size": 1681}
      ]
     },
    ]
   }
      }
  },

  asyncData ({ store, route: { params: { id }}}) {
    return store.dispatch('FETCH_USER', { id })
  },

  title () {
    return this.user
      ? this.user.id
      : 'User not found'
  },

  methods: {
    getTransactions () {
      fetch("/transactions", {
        method: "POST"
      })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        this.transactions = data.transactions

        // format data into the format as flare.json in this https://bl.ocks.org/mbostock/4063582
        // group by catagory that is common
        // const catagories
      })
    },

    createTreemap () {
      console.log("creating treemap")
      var svg = d3.select("svg"),
          width = +svg.attr("width"),
          height = +svg.attr("height");

      var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); },
          color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
          format = d3.format(",d");

      var treemap = d3.treemap()
          .tile(d3.treemapResquarify)
          .size([width, height])
          .round(true)
          .paddingInner(1);

      var data = this.data;

      var root = d3.hierarchy(data)
        .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
        .sum((d) => d.size)
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

        treemap(root);

        var cell = svg.selectAll("g")
          .data(root.leaves())
          .enter().append("g")
          .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

        cell.append("rect")
          .attr("id", function(d) { return d.data.id; })
          .attr("width", function(d) { return d.x1 - d.x0; })
          .attr("height", function(d) { return d.y1 - d.y0; })
          .attr("fill", function(d) { return color(d.parent.data.id); });

        cell.append("clipPath")
          .attr("id", function(d) { return "clip-" + d.data.id; })
          .append("use")
          .attr("xlink:href", function(d) { return "#" + d.data.id; });

        cell.append("text")
          .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
          .selectAll("tspan")
          .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
          .enter().append("tspan")
          .attr("x", 4)
          .attr("y", function(d, i) { return 13 + i * 10; })
          .text(function(d) { return d; });

        cell.append("title")
          .text(function(d) { return d.data.id + "\n" + format(d.value); });
    }
  }
}
</script>

<style lang="stylus">
.user-view
  background-color #fff
  box-sizing border-box
  padding 2em 3em
  h1
    margin 0
    font-size 1.5em
  .meta
    list-style-type none
    padding 0
  .label
    display inline-block
    min-width 4em
  .about
    margin 1em 0
  .links a
    text-decoration underline
</style>
