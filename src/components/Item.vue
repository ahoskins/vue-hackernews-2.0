<template>
  <li class="news-item">
    <img v-bind:src="url" height="50" width="50" class="transaction" />
    <span class="score">$ {{ item.amount }}</span>
    <span class="title">
      <template v-if="item.url">
        <a :href="item.url" target="_blank" rel="noopener">{{ item.title }}</a>
        <span class="host"> ({{ item.url | host }})</span>
      </template>
      <template v-else>
        <router-link :to="'/item/' + item.id">{{ item.name }}</router-link>
      </template>
    </span>
    <br>
    <span class="meta">
      <span class="time">
        {{ item.date }}
      </span>
    </span>
  </li>
</template>

<script>
import { timeAgo } from '../util/filters'

export default {
  name: 'news-item',
  props: ['item'],
  // http://ssr.vuejs.org/en/caching.html#component-level-caching
  serverCacheKey: ({ item: { id, __lastUpdated, time }}) => {
    return `${id}::${__lastUpdated}::${timeAgo(time)}`
  },

  beforeMount () {
    this.fetchImage()
  },

  data () {
    return {
      url: ""
    }
  },

  methods: {
    fetchImage () {
      const { constants } = this.$store.state
      const { GOOGLE_CUSTOM_SEARCH_KEY } = constants
      const YELP_CX = "012718715501588327320:jqxfmv_rkuq"
      // https://cse.google.com/cse/setup/basic?cx=012718715501588327320:jqxfmv_rkuq
      // andrewhoskins.ca email account
    
      // go google request
      const req = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_CUSTOM_SEARCH_KEY}&cx=${YELP_CX}&q=${this.item.name}&searchType=image`

      fetch(req)
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data.items[0].link);
        this.url = data.items[0].link
      })
    }
  }
}
</script>

<style lang="stylus">
img.transaction
  background-position center
  background-size cover

.news-item
  background-color #fff
  padding 20px 30px 20px 80px
  border-bottom 1px solid #eee
  position relative
  line-height 20px
  .score
    color #ff6600
    font-size 1.1em
    font-weight 700
    position absolute
    top 50%
    left 0
    width 80px
    text-align center
    margin-top -10px
  .meta, .host
    font-size .85em
    color #828282
    a
      color #828282
      text-decoration underline
      &:hover
        color #ff6600
</style>
